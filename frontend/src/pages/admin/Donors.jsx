import { Droplet } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function AdminDonors() {
  return (
    <PlaceholderPage
      title="Donor Management"
      description="Registered donors, verification state and donation records."
      icon={Droplet}
    />
  );
}