import { cn } from "../../utils/cn";

/**
 * One stop on the blood journey.
 *
 * The right padding always reserves exactly as much room as the droplet rail
 * occupies at that breakpoint (34vw desktop, 36vw tablet, 80px phone), so the
 * animation can never sit on top of anything readable.
 */
export function JourneySection({ id, children, className, minFull = true }) {
  return (
    <section
      id={id}
      className={cn(
        "bl-content relative flex items-center scroll-mt-20",
        minFull && "min-h-screen",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pr-20 py-20 sm:px-6 sm:pr-[36vw] lg:px-8 lg:pr-[34vw]">
        {children}
      </div>
    </section>
  );
}

export default JourneySection;