import { Users } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function AdminUsers() {
  return (
    <PlaceholderPage
      title="User Management"
      description="All registered accounts, roles and account status."
      icon={Users}
    />
  );
}