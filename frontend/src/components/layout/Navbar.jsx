import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Droplet, Menu, X, PanelLeft } from "lucide-react";
import { PUBLIC_NAV, ROUTES } from "../../constants";
import { useUI } from "../../context/UIContext";
import { useJourney } from "../../context/JourneyContext";
import { scrollToJourneySection } from "../../hooks/useBloodJourney";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";

function Brand() {
  return (
    <Link to={ROUTES.HOME} className="flex items-center gap-2">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-light">
        <Droplet className="w-5 h-5 text-primary" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold text-gray-900">
        Blood<span className="text-primary">Link</span>
      </span>
    </Link>
  );
}

/**
 * Decides whether a public nav item is active, and what clicking it does.
 *
 * On the home route the four sections live on one scroll journey, so the
 * active tab follows the droplet (from context) rather than the URL, and a
 * click scrubs to that section instead of navigating. Everywhere else — and
 * if the journey ever fails to mount — this falls straight back to normal
 * NavLink/route behaviour, so /about, /how-it-works and /contact keep working
 * exactly as they did before.
 */
function usePublicNav(onNavigate) {
  const { pathname } = useLocation();
  const { activeIndex, isJourneyActive, setActiveIndex } = useJourney();
  const onJourney = isJourneyActive && pathname === ROUTES.HOME;

  const isItemActive = (index, routerActive) =>
    onJourney ? index === activeIndex : routerActive;

  const handleClick = (item, index) => (event) => {
    onNavigate?.();
    if (!onJourney || !item.section) return;
    if (!document.getElementById(item.section)) return;

    event.preventDefault();
    setActiveIndex(index);
    scrollToJourneySection(item.section);
  };

  return { isItemActive, handleClick };
}

export function Navbar({ variant = "public", title }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { isItemActive, handleClick } = usePublicNav(() => setMobileOpen(false));

  if (variant === "dashboard") {
    return <DashboardNavbar title={title} />;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Brand />

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {PUBLIC_NAV.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.HOME}
                onClick={handleClick(item, index)}
                className={({ isActive }) =>
                  cn(
                    "relative px-3 py-2 rounded-lg text-sm font-medium",
                    "transition-colors duration-500 ease-out",
                    isItemActive(index, isActive)
                      ? "text-primary bg-primary-light"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary",
                        "origin-left transition-transform duration-500 ease-out",
                        isItemActive(index, isActive) ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
              Log in
            </Button>
            <Button as={Link} to={ROUTES.REGISTER} size="sm">
              Register
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1" aria-label="Mobile">
            {PUBLIC_NAV.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ROUTES.HOME}
                  onClick={handleClick(item, index)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                      "transition-colors duration-500 ease-out",
                      isItemActive(index, isActive)
                        ? "text-primary bg-primary-light"
                        : "text-gray-600 hover:bg-gray-50"
                    )
                  }
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
            <div className="pt-2 flex gap-2">
              <Button
                as={Link}
                to={ROUTES.LOGIN}
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Button>
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                size="sm"
                fullWidth
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function DashboardNavbar({ title }) {
  const { toggleSidebar } = useUI();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <Brand />
        </div>

        <span className="hidden lg:block text-sm font-semibold text-gray-700">
          {title}
        </span>

        <div className="ml-auto">
          <Button as={Link} to={ROUTES.HOME} variant="ghost" size="sm">
            Back to site
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;