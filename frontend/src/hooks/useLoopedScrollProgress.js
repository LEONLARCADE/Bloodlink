import { useEffect, useState } from "react";

/**
 * Scroll progress that wraps forever: (scrollY mod cycleLength) / cycleLength.
 * The browser's scroll position is never touched — only this fractional
 * value resets, so there is no visible jump. Every `cycleLength` pixels of
 * real scrolling plays one full loop of the animation.
 */
export function useLoopedScrollProgress(cycleLength = 1400) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const y = Math.max(0, window.scrollY);
      const cycles = y / cycleLength;
      setProgress(cycles - Math.floor(cycles)); // fractional part, always in [0, 1)
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
  }, [cycleLength]);

  return progress;
}

export default useLoopedScrollProgress;