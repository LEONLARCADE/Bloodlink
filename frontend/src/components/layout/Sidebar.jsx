import { NavLink, Link } from "react-router-dom";
import { Droplet, X } from "lucide-react";
import { useUI } from "../../context/UIContext";
import { ROUTES } from "../../constants";
import { cn } from "../../utils/cn";

export function Sidebar({ items = [], title = "Dashboard" }) {
  const { isSidebarOpen, closeSidebar } = useUI();

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100",
          "flex flex-col transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-light">
              <Droplet className="w-4 h-4 text-primary" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-gray-900">
              Blood<span className="text-primary">Link</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {title}
        </p>

        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Accounts &amp; sessions arrive in a later phase.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;