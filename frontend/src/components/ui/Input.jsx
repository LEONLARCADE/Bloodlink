import { useId } from "react";
import { cn } from "../../utils/cn";

export function Input({
  label,
  hint,
  error,
  icon: Icon,
  className,
  containerClassName,
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error
    ? `${inputId}-error`
    : hint
    ? `${inputId}-hint`
    : undefined;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-primary ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            aria-hidden="true"
          />
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full h-11 rounded-xl border bg-white text-sm text-gray-900",
            "placeholder:text-gray-400 shadow-sm",
            "transition focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:bg-gray-50 disabled:text-gray-500",
            Icon ? "pl-9 pr-3" : "px-3",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-200 focus:border-primary focus:ring-primary/30",
            className
          )}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Input;