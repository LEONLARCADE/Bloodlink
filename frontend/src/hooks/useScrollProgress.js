import { useEffect, useState } from "react";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * Document scroll progress in [0, 1], throttled to one update per frame.
 * The entire blood animation is a pure function of this value — nothing
 * plays on a timer, so the visual state always matches scroll position.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? clamp(doc.scrollTop / max) : 0);
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
  }, []);

  return progress;
}

export default useScrollProgress;