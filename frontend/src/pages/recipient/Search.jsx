import { Search } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function RecipientSearch() {
  return (
    <PlaceholderPage
      title="Find Donors"
      description="Search available donors by blood group, location and availability."
      icon={Search}
    />
  );
}