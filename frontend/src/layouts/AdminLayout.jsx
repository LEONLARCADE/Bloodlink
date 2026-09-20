import DashboardLayout from "./DashboardLayout";
import { ROLES } from "../constants";

export function AdminLayout() {
  return <DashboardLayout role={ROLES.ADMIN} />;
}

export default AdminLayout;