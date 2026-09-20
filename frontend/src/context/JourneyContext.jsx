import { createContext, useContext, useMemo, useState } from "react";

/**
 * Shares the scroll-journey state between the animation (rendered inside the
 * router Outlet) and the Navbar (rendered by PublicLayout, outside it).
 *
 * Only two values ever change here, and both change rarely — the active
 * section index (four times per cycle) and whether a journey is mounted at
 * all. Per-frame droplet state deliberately never enters React; it is
 * written straight to the DOM by the rAF loop.
 */

const JourneyContext = createContext(null);

const FALLBACK = {
  activeIndex: 0,
  setActiveIndex: () => {},
  isJourneyActive: false,
  setJourneyActive: () => {},
};

export function JourneyProvider({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isJourneyActive, setJourneyActive] = useState(false);

  const value = useMemo(
    () => ({ activeIndex, setActiveIndex, isJourneyActive, setJourneyActive }),
    [activeIndex, isJourneyActive]
  );

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

/** Safe outside the provider (dashboard layouts) — returns an inert object. */
export function useJourney() {
  return useContext(JourneyContext) ?? FALLBACK;
}

export default JourneyContext;