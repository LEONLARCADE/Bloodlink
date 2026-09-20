import { LayoutDashboard } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function AdminDashboard() {
  return (
    <PlaceholderPage
      title="Admin Dashboard"
      description="Platform-wide metrics: users, active requests and fulfilment rate."
      icon={LayoutDashboard}
    />
  );
}