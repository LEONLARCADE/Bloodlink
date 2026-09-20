import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { SIDEBAR_NAV, ROLE_LABELS } from "../constants";

/**
 * Shared shell for every authenticated area.
 * Role-specific layouts (Donor/Recipient/Admin) only pass a role here.
 */
export function DashboardLayout({ role }) {
  const items = SIDEBAR_NAV[role] ?? [];
  const title = ROLE_LABELS[role] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar items={items} title={title} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar variant="dashboard" title={title} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;