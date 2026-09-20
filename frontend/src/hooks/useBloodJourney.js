import { useEffect, useRef } from "react";

const clamp = (v, min = 0, max = 1) => (v < min ? min : v > max ? max : v);

/** Height of the sticky navbar — the scroll "focus line" sits just under it. */
const NAV_OFFSET = 72;

/** Wheel/touch pixels past the document bottom before the loop fires. */
const LOOP_THRESHOLD = 190;

/** Ignore further loop triggers for this long after one fires. */
const LOOP_COOLDOWN_MS = 1600;

/** Lerp factor per frame. Lower = heavier, more liquid. */
const EASE = 0.14;

/** Below this delta the loop parks itself — "stops naturally when scrolling stops". */
const REST = 0.00035;

/**
 * Smooth-scrolls to a journey section, honouring the sticky navbar.
 * Exported so the Navbar can use it without duplicating the offset maths.
 */
export function scrollToJourneySection(id, behavior = "smooth") {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - (NAV_OFFSET - 8);
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

/**
 * The scroll-progress controller behind the blood journey.
 *
 * Progress is *section-relative*, not raw document-relative:
 *
 *     fall = (sectionIndex + progressWithinSection) / sectionCount
 *
 * so the droplet is exactly 25% fallen when ABOUT US begins, 50% at HOW IT
 * WORKS and 75% at CONTACT US, no matter how much the sections differ in
 * height. That's what makes the navigation feel physically wired to the drop
 * rather than merely correlated with it.
 *
 * A second value, `impact`, tracks progress through the pool zone after the
 * last section and drives the splash, ripples and rebound — all scrubbable,
 * so scrolling back up rewinds the splash instead of replaying it.
 *
 * Nothing here calls setState per frame. `onPaint` receives raw numbers and
 * is expected to write transforms directly to refs; `onSection` fires only
 * when the active nav index actually changes.
 */
export function useBloodJourney({
  sectionIds = [],
  poolZoneId = null,
  enabled = true,
  onPaint,
  onSection,
  onLoop,
} = {}) {
  const paintRef = useRef(onPaint);
  const sectionRef = useRef(onSection);
  const loopRef = useRef(onLoop);

  paintRef.current = onPaint;
  sectionRef.current = onSection;
  loopRef.current = onLoop;

  const key = sectionIds.join("|");

  useEffect(() => {
    const ids = key ? key.split("|") : [];
    if (!enabled || ids.length === 0) return undefined;

    let frame = null;
    let bounds = [];
    let pool = null;

    const target = { fall: 0, impact: 0 };
    const view = { fall: 0, impact: 0 };

    let speed = 0;
    let lastIndex = -1;
    let overscroll = 0;
    let lockedUntil = 0;
    let touchY = null;

    /* ── measurement ───────────────────────────────────────────────────── */

    const measure = () => {
      bounds = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((el) => ({ top: el.offsetTop, height: Math.max(1, el.offsetHeight) }));

      const zone = poolZoneId ? document.getElementById(poolZoneId) : null;
      pool = zone
        ? { top: zone.offsetTop, height: Math.max(1, zone.offsetHeight) }
        : null;
    };

    /* ── read scroll → target progress ─────────────────────────────────── */

    const read = () => {
      if (bounds.length === 0) return;

      const focus = window.scrollY + NAV_OFFSET;
      const n = bounds.length;
      const last = bounds[n - 1];

      let fall;
      if (focus <= bounds[0].top) {
        fall = 0;
      } else if (focus >= last.top + last.height) {
        fall = 1;
      } else {
        let index = n - 1;
        let local = 1;
        for (let i = 0; i < n; i += 1) {
          const { top, height } = bounds[i];
          if (focus < top + height) {
            index = i;
            local = clamp((focus - top) / height);
            break;
          }
        }
        fall = clamp((index + local) / n);
      }

      target.fall = fall;
      target.impact = pool ? clamp((focus - pool.top) / pool.height) : 0;
    };

    /* ── the loop ──────────────────────────────────────────────────────── */

    const paint = () => {
      frame = null;

      const prevFall = view.fall;
      const dFall = target.fall - view.fall;
      const dImpact = target.impact - view.impact;
      const settled = Math.abs(dFall) < REST && Math.abs(dImpact) < REST;

      if (settled) {
        view.fall = target.fall;
        view.impact = target.impact;
      } else {
        view.fall += dFall * EASE;
        view.impact += dImpact * EASE;
      }

      // Per-frame velocity, smoothed — this is what stretches the droplet.
      speed += ((view.fall - prevFall) - speed) * 0.25;

      paintRef.current?.({
        fall: view.fall,
        impact: view.impact,
        speed,
      });

      const index = Math.min(
        bounds.length - 1,
        Math.max(0, Math.floor(view.fall * bounds.length - 1e-6))
      );
      if (index !== lastIndex) {
        lastIndex = index;
        sectionRef.current?.(index);
      }

      // Park when there's nothing left to move. Any scroll restarts us.
      if (!settled || Math.abs(speed) > REST) {
        frame = window.requestAnimationFrame(paint);
      } else {
        speed = 0;
      }
    };

    const kick = () => {
      if (frame === null) frame = window.requestAnimationFrame(paint);
    };

    const onScroll = () => {
      read();
      kick();
    };

    const onResize = () => {
      measure();
      read();
      kick();
    };

    /* ── infinite loop: overscroll past the bottom ─────────────────────── */

    const atBottom = () => {
      const doc = document.documentElement;
      return window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
    };

    const tryLoop = (delta) => {
      if (delta <= 0 || !atBottom()) {
        overscroll = 0;
        return;
      }
      overscroll += delta;
      if (overscroll < LOOP_THRESHOLD) return;
      if (Date.now() < lockedUntil) return;

      overscroll = 0;
      lockedUntil = Date.now() + LOOP_COOLDOWN_MS;
      loopRef.current?.();
    };

    const onWheel = (e) => tryLoop(e.deltaY);

    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? null;
      overscroll = 0;
    };

    const onTouchMove = (e) => {
      const y = e.touches[0]?.clientY;
      if (y == null || touchY == null) return;
      tryLoop(touchY - y); // finger moving up = scrolling down
      touchY = y;
    };

    /* ── wiring ────────────────────────────────────────────────────────── */

    measure();
    read();
    view.fall = target.fall;
    view.impact = target.impact;
    kick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Sections grow and shrink as fonts load and images settle.
    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(onResize);
      observer.observe(document.body);
    }

    const settleTimer = window.setTimeout(onResize, 350);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [key, poolZoneId, enabled]);
}

export default useBloodJourney;