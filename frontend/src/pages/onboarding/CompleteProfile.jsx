import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardBody, LoadingSpinner } from "../../components/ui";
import DonorProfileForm from "../../components/profile/DonorProfileForm";
import RecipientProfileForm from "../../components/profile/RecipientProfileForm";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const ROLE_HOME = {
  DONOR: ROUTES.DONOR.DASHBOARD,
  RECIPIENT: ROUTES.RECIPIENT.DASHBOARD,
  ADMIN: ROUTES.ADMIN.DASHBOARD,
};

export default function CompleteProfile() {
  useDocumentTitle("Complete Your Profile");
  const { user, isLoading, markProfileComplete } = useAuth();
  const navigate = useNavigate();

  // Users who already completed onboarding shouldn't be forced back through
  // it — send them straight to their dashboard instead.
  useEffect(() => {
    if (!isLoading && user?.hasProfile) {
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading your account" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.hasProfile) {
    // Effect above will redirect; render nothing in the meantime.
    return null;
  }

  const handleSaved = () => {
    markProfileComplete();
    navigate(ROLE_HOME[user.role] || "/", { replace: true });
  };

  const isDonor = user.role === "DONOR";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="flex items-start gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-light shrink-0">
              <UserCog className="w-5 h-5 text-primary" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>One last step</CardTitle>
              <CardDescription>
                {isDonor
                  ? "Tell us your blood group and location so recipients can find you."
                  : "Tell us your location so we can route the right requests your way."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            {isDonor ? (
              <DonorProfileForm onSaved={handleSaved} submitLabel="Complete profile" />
            ) : (
              <RecipientProfileForm onSaved={handleSaved} submitLabel="Complete profile" />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}