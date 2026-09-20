import { Quote } from "lucide-react";
import { cn } from "../../utils/cn";

export function SectionQuote({ children, align = "left", className }) {
  return (
    <figure
      className={cn(
        "mt-10 max-w-xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Quote
        className={cn(
          "w-6 h-6 text-primary/50",
          align === "center" && "mx-auto"
        )}
        aria-hidden="true"
      />
      <blockquote className="mt-3 text-xl sm:text-2xl font-semibold leading-snug text-gray-800">
        “{children}”
      </blockquote>
    </figure>
  );
}

export default SectionQuote;