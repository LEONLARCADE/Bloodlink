import { KeyRound } from "lucide-react";
import PlaceholderPage from "../../components/common/PlaceholderPage";

export default function ForgotPassword() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <PlaceholderPage
        title="Forgot Password"
        description="Request a password reset link for your BloodLink account."
        icon={KeyRound}
      />
    </div>
  );
}