import DashboardLayout from "./DashboardLayout";
import { ROLES } from "../constants";

export function DonorLayout() {
  return <DashboardLayout role={ROLES.DONOR} />;
}

export default DonorLayout;