import { cn } from "../../utils/cn";

const VARIANTS = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-primary-light text-primary",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-sky-50 text-sky-700",
};

export function Badge({ variant = "default", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
        "text-xs font-semibold",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;