import { useCallback, useEffect, useRef } from "react";
import BleedingHand, { HAND_DRIP_ANCHOR } from "./BleedingHand";
import useBloodJourney from "../../hooks/useBloodJourney";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import useActiveSection from "../../hooks/useActiveSection";
import { useJourney } from "../../context/JourneyContext";

/* ── maths ───────────────────────────────────────────────────────────────── */

const clamp = (v, min = 0, max = 1) => (v < min ? min : v > max ? max : v);
const norm = (v, a, b) => (b === a ? 0 : clamp((v - a) / (b - a)));
const easeOut = (t) => 1 - (1 - t) ** 3;

/* ── layout constants ────────────────────────────────────────────────────── */

const DROP_H = 30; // px, matches the droplet svg height
const POOL_SURFACE = 46; // px above the rail's bottom edge — just under the pool surface
const RING_COUNT = 3;
const SECOND_RING_COUNT = 2;

/**
 * Everything visible in the journey. Rendered once, fixed to the viewport,
 * and driven entirely by direct DOM writes from a single rAF loop — no React
 * state changes per frame, so the four content sections never re-render while
 * you scroll.
 */
export function BloodJourney({ sectionIds, poolZoneId }) {
  const reduced = usePrefersReducedMotion();
  const { setActiveIndex, setJourneyActive } = useJourney();

  const railRef = useRef(null);
  const handWrapRef = useRef(null);
  const beadRef = useRef(null);
  const neckRef = useRef(null);
  const dropRef = useRef(null);
  const reboundRef = useRef(null);
  const poolRef = useRef(null);
  const ringsRef = useRef([]);
  const secondRingsRef = useRef([]);
  const washRef = useRef(null);
  const timersRef = useRef([]);

  const geo = useRef({ start: 0, end: 0, railH: 0 });

  /* Tell the Navbar a journey is live on this page. */
  useEffect(() => {
    setJourneyActive(true);
    return () => {
      setJourneyActive(false);
      setActiveIndex(0);
    };
  }, [setJourneyActive, setActiveIndex]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(window.clearTimeout);
  }, []);

  /* ── geometry ──────────────────────────────────────────────────────────── */

  const measure = useCallback(() => {
    const rail = railRef.current;
    const hand = handWrapRef.current;
    if (!rail || !hand) return;

    const railBox = rail.getBoundingClientRect();
    const handBox = hand.getBoundingClientRect();

    geo.current.railH = railBox.height;
    geo.current.start = handBox.top - railBox.top + handBox.height * HAND_DRIP_ANCHOR.y;
    geo.current.end = railBox.height - POOL_SURFACE;
  }, []);

  useEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    return () => ro.disconnect();
  }, [measure]);

  /* ── per-frame paint ───────────────────────────────────────────────────── */

  const paint = useCallback(({ fall, impact, speed }) => {
    const { start, end, railH } = geo.current;
    const travel = Math.max(1, end - start);

    /* 1 — bead swelling at the drip edge, then pinching off */
    const swell = easeOut(norm(fall, 0, 0.055));
    const pinch = norm(fall, 0.05, 0.115);
    const detached = fall >= 0.105;

    if (beadRef.current) {
      let sx;
      let sy;
      if (detached) {
        // a small residual welling stays behind — the hand is still bleeding
        const residual = 0.2 + 0.35 * (1 - norm(fall, 0.105, 0.6));
        sx = residual;
        sy = residual;
      } else {
        sx = 0.22 + 0.78 * swell;
        sy = sx * (1 + pinch * 1.5);
      }
      beadRef.current.setAttribute(
        "transform",
        `translate(98 212) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-98 -212)`
      );
      beadRef.current.style.opacity = detached ? "0.85" : "1";
    }

    if (neckRef.current) {
      const necking = detached ? 1 - norm(fall, 0.105, 0.2) : pinch;
      const sy = 0.25 + necking * 2.4;
      const sx = 1 - necking * 0.6;
      neckRef.current.setAttribute(
        "transform",
        `translate(98 208) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-98 -208)`
      );
      neckRef.current.style.opacity = (0.25 + necking * 0.75).toFixed(3);
    }

    /* The hand recedes a little once it has given up its drop. */
    if (handWrapRef.current) {
      handWrapRef.current.style.opacity = (1 - 0.35 * norm(fall, 0.1, 0.34)).toFixed(3);
    }

    /* 2 — the droplet falls, stretching with its own velocity */
    if (dropRef.current) {
      const t = norm(fall, 0.1, 1);
      if (t <= 0 || t >= 1) {
        dropRef.current.style.opacity = "0";
      } else {
        const gravity = t ** 1.6; // accelerates, as it should
        const y = start + gravity * travel - DROP_H;

        const velocityStretch = clamp(Math.abs(speed) * 34, 0, 1);
        const sy = 1 + velocityStretch * 0.85 + t * 0.3;
        const sx = 1 / (1 + (sy - 1) * 0.62);

        dropRef.current.style.transform = `translate3d(0, ${y.toFixed(
          1
        )}px, 0) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
        dropRef.current.style.opacity = (
          Math.min(1, t * 14) * (1 - norm(t, 0.99, 1))
        ).toFixed(3);
      }
    }

    /* 3 — the pool, growing as the drop nears and bulging on impact */
    if (poolRef.current) {
      const growth = norm(fall, 0.45, 1);
      const bulge = easeOut(norm(impact, 0, 0.18));
      const sx = 0.46 + growth * 0.4 + bulge * 0.16;
      const sy = 0.58 + growth * 0.32 + bulge * 0.1;
      poolRef.current.style.transform = `translateX(-50%) scale(${sx.toFixed(
        3
      )}, ${sy.toFixed(3)})`;
      poolRef.current.style.opacity = (0.2 + growth * 0.8).toFixed(3);
    }

    /* 4 — primary impact: concentric rings expanding outward */
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const t = clamp((impact - i * 0.06) / 0.5);
      if (t <= 0) {
        ring.style.opacity = "0";
        return;
      }
      const eased = easeOut(t);
      ring.setAttribute("r", (8 + eased * 92).toFixed(1));
      ring.setAttribute("stroke-width", (3.4 * (1 - eased) + 0.5).toFixed(2));
      ring.style.opacity = ((1 - t) * 0.6).toFixed(3);
    });

    /* 5 — the rebound droplet: up, then back into the pool */
    if (reboundRef.current) {
      const t = norm(impact, 0.06, 0.55);
      if (t <= 0 || t >= 1) {
        reboundRef.current.style.opacity = "0";
      } else {
        const arc = Math.sin(Math.PI * t);
        const y = end - arc * railH * 0.19 - DROP_H * 0.55;
        const rise = Math.cos(Math.PI * t); // +1 going up, -1 coming down
        const sy = 1 + Math.abs(rise) * 0.3;
        const sx = 1 / (1 + (sy - 1) * 0.6);
        const s = 0.52 + arc * 0.08;

        reboundRef.current.style.transform = `translate3d(0, ${y.toFixed(
          1
        )}px, 0) scale(${(sx * s).toFixed(3)}, ${(sy * s).toFixed(3)})`;
        reboundRef.current.style.opacity = (
          Math.min(1, t * 9) * Math.min(1, (1 - t) * 9)
        ).toFixed(3);
      }
    }

    /* 6 — the subtler second ripple from the rebound landing */
    secondRingsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const t = clamp((impact - 0.54 - i * 0.05) / 0.4);
      if (t <= 0) {
        ring.style.opacity = "0";
        return;
      }
      const eased = easeOut(t);
      ring.setAttribute("r", (6 + eased * 54).toFixed(1));
      ring.setAttribute("stroke-width", (2.4 * (1 - eased) + 0.4).toFixed(2));
      ring.style.opacity = ((1 - t) * 0.42).toFixed(3);
    });
  }, []);

  /* ── nav sync ──────────────────────────────────────────────────────────── */

  const handleSection = useCallback(
    (index) => setActiveIndex(index),
    [setActiveIndex]
  );

  /* ── the seamless loop back to HOME ────────────────────────────────────── */

  const handleLoop = useCallback(() => {
    const wash = washRef.current;
    if (!wash) return;

    wash.classList.remove("bl-wash--on");
    void wash.offsetWidth; // restart the animation
    wash.classList.add("bl-wash--on");

    timersRef.current.push(
      window.setTimeout(() => window.scrollTo(0, 0), 300),
      window.setTimeout(() => wash.classList.remove("bl-wash--on"), 980)
    );
  }, []);

  useBloodJourney({
    sectionIds,
    poolZoneId,
    enabled: !reduced,
    onPaint: paint,
    onSection: handleSection,
    onLoop: handleLoop,
  });

  /* Reduced motion: no rAF, no droplet. Fall back to the existing
     IntersectionObserver hook so the navbar still tracks the page. */
  const observedId = useActiveSection(reduced ? sectionIds : [], sectionIds[0]);

  useEffect(() => {
    if (!reduced || !observedId) return;
    const index = sectionIds.indexOf(observedId);
    if (index >= 0) setActiveIndex(index);
  }, [reduced, observedId, sectionIds, setActiveIndex]);

  /* Paint a sensible resting frame once when motion is reduced. */
  useEffect(() => {
    if (!reduced) return;
    measure();
    paint({ fall: 0.04, impact: 0, speed: 0 });
  }, [reduced, measure, paint]);

  return (
    <>
      <div className="bl-layer" aria-hidden="true">
        {/* Self-contained gradients so the droplets never depend on the
            hand's <defs> being mounted. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <radialGradient id="bl-drop-grad" cx="0.36" cy="0.3" r="0.85">
              <stop offset="0%" stopColor="#ef4a52" />
              <stop offset="45%" stopColor="#c01820" />
              <stop offset="100%" stopColor="#7f0f14" />
            </radialGradient>
          </defs>
        </svg>

        <div ref={railRef} className="bl-rail">
          <div
            ref={handWrapRef}
            className="absolute left-0 right-0 top-[9vh] lg:top-[13vh]"
          >
            <BleedingHand beadRef={beadRef} neckRef={neckRef} idle={reduced} />
          </div>

          {/* falling droplet */}
          <svg
            ref={dropRef}
            className="bl-drop bl-gpu"
            width="22"
            height="30"
            viewBox="0 0 22 30"
            style={{ opacity: 0 }}
          >
            <path
              d="M11 0 Q21 17 21 22 a10 10 0 0 1 -20 0 Q1 17 11 0 z"
              fill="url(#bl-drop-grad)"
            />
            <ellipse cx="7.5" cy="20" rx="2.6" ry="3.6" fill="#fff" opacity="0.28" />
          </svg>

          {/* rebound droplet */}
          <svg
            ref={reboundRef}
            className="bl-rebound bl-gpu"
            width="22"
            height="30"
            viewBox="0 0 22 30"
            style={{ opacity: 0 }}
          >
            <path
              d="M11 0 Q21 17 21 22 a10 10 0 0 1 -20 0 Q1 17 11 0 z"
              fill="url(#bl-drop-grad)"
            />
          </svg>

          {/* pool + ripples */}
          <svg
            ref={poolRef}
            className="bl-pool bl-gpu"
            width="280"
            height="130"
            viewBox="0 0 240 130"
            style={{ opacity: 0 }}
          >
            <g fill="none" stroke="#b3161c">
              {Array.from({ length: RING_COUNT }).map((_, i) => (
                <circle
                  key={`r${i}`}
                  ref={(el) => {
                    ringsRef.current[i] = el;
                  }}
                  cx="120"
                  cy="82"
                  r="8"
                  style={{ opacity: 0 }}
                />
              ))}
              {Array.from({ length: SECOND_RING_COUNT }).map((_, i) => (
                <circle
                  key={`s${i}`}
                  ref={(el) => {
                    secondRingsRef.current[i] = el;
                  }}
                  cx="120"
                  cy="82"
                  r="6"
                  style={{ opacity: 0 }}
                />
              ))}
            </g>

            <ellipse cx="120" cy="82" rx="112" ry="26" fill="#b3161c" opacity="0.14" />
            <ellipse cx="120" cy="82" rx="86" ry="19" fill="url(#bl-drop-grad)" opacity="0.72" />
            <ellipse cx="98" cy="76" rx="20" ry="5" fill="#fff" opacity="0.16" />
          </svg>
        </div>
      </div>

      <div ref={washRef} className="bl-wash" aria-hidden="true" />
    </>
  );
}

export default BloodJourney;