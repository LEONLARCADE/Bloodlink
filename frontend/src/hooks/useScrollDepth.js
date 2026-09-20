import { useEffect, useState } from "react";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * How far the page has scrolled past the first viewport, as 0 → 1.
 *
 * Used to dim the hero hand once the user has moved on to the content
 * sections, so the artwork never competes with text. The hand itself never
 * moves — only its opacity changes.
 */
export function useScrollDepth(viewports = 1) {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const span = window.innerHeight * viewports || 1;
      setDepth(clamp(window.scrollY / span));
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [viewports]);

  return depth;
}

export default useScrollDepth;