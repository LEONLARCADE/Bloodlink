import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  info: {
    icon: Info,
    className: "bg-sky-50 text-sky-800 border-sky-200",
    iconClass: "text-sky-500",
  },
  success: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    iconClass: "text-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-800 border-amber-200",
    iconClass: "text-amber-500",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 text-red-800 border-red-200",
    iconClass: "text-red-500",
  },
};

export function Alert({ variant = "info", title, children, onDismiss, className }) {
  const { icon: Icon, className: variantClass, iconClass } = VARIANTS[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        variantClass,
        className
      )}
    >
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", iconClass)} aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-0.5")}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="p-0.5 rounded hover:bg-black/5 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;