import { FileText } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function AdminRequests() {
  return (
    <PlaceholderPage
      title="Request Management"
      description="Every blood request on the platform, with status and matched donors."
      icon={FileText}
    />
  );
}