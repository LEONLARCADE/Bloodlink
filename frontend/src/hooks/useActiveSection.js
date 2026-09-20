import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently occupying the middle of the viewport.
 * The rootMargin creates a thin horizontal band across the screen centre, so
 * exactly one section is "active" at a time regardless of section height.
 */
export function useActiveSection(ids = [], fallback = ids[0] ?? null) {
  const [activeId, setActiveId] = useState(fallback);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || ids.length === 0) {
      return undefined;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return activeId;
}

export default useActiveSection;