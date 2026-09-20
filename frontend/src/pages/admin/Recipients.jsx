import { User } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function AdminRecipients() {
  return (
    <PlaceholderPage
      title="Recipient Management"
      description="Registered recipients and their request histories."
      icon={User}
    />
  );
}