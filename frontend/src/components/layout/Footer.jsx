import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";
import { APP_NAME, APP_TAGLINE, PUBLIC_NAV, ROUTES } from "../../constants";

/**
 * Public site footer.
 *
 * NOTE: this file previously contained a byte-for-byte copy of
 * components/layout/Sidebar.jsx, so PublicLayout was rendering a dashboard
 * sidebar where the footer belongs. This replaces it with an actual footer;
 * Sidebar.jsx itself is untouched and DashboardLayout still imports it.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bl-content relative border-t border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
              <Droplet className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold text-gray-900">
              Blood<span className="text-primary">Link</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-gray-500">{APP_TAGLINE}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Explore
          </h2>
          <ul className="mt-3 space-y-2">
            {PUBLIC_NAV.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-gray-600 transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Get started
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                to={ROUTES.REGISTER}
                className="text-sm text-gray-600 transition-colors hover:text-primary"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-gray-600 transition-colors hover:text-primary"
              >
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400">
            © {year} {APP_NAME}. BloodLink helps you find and contact donors; it
            does not determine medical eligibility. Confirm every donation with
            a qualified healthcare professional or blood bank.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;