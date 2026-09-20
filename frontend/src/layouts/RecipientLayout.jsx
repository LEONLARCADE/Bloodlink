import DashboardLayout from "./DashboardLayout";
import { ROLES } from "../constants";

export function RecipientLayout() {
  return <DashboardLayout role={ROLES.RECIPIENT} />;
}

export default RecipientLayout;