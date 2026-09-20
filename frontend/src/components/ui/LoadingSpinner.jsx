import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const SIZES = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-9 h-9" };

export function LoadingSpinner({ size = "md", label = "Loading", className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center justify-center gap-2 text-primary", className)}
    >
      <Loader2 className={cn("animate-spin", SIZES[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingSpinner;