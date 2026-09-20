import { cn } from "../../utils/cn";

export function PageHeader({ title, description, icon: Icon, actions, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        "pb-5 mb-6 border-b border-gray-100",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-light shrink-0">
            <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
          </span>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">{description}</p>
          )}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;