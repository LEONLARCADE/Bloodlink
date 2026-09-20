import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary shadow-sm",
  secondary:
    "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-400 shadow-sm",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary-light focus-visible:ring-primary",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4" aria-hidden="true" />
      )}
      {children}
      {RightIcon && !isLoading && (
        <RightIcon className="w-4 h-4" aria-hidden="true" />
      )}
    </Component>
  );
}

export default Button;