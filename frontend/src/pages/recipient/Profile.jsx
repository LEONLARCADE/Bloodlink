import { useEffect, useState } from "react";
import { User } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardBody, Alert, LoadingSpinner } from "../../components/ui";
import RecipientProfileForm from "../../components/profile/RecipientProfileForm";
import { fetchMyProfile } from "../../api/profile";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function RecipientProfile() {
  useDocumentTitle("Recipient Profile");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchMyProfile()
      .then((data) => {
        if (isMounted) setProfile(data);
      })
      .catch((err) => {
        if (isMounted) setLoadError(err.message || "Couldn't load your profile");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaved = (updated) => {
    setProfile(updated);
    setJustSaved(true);
  };

  return (
    <section>
      <PageHeader
        title="Recipient Profile"
        description="Your location and, if known, blood group."
        icon={User}
      />

      <Card>
        <CardBody>
          {isLoading ? (
            <div className="py-8">
              <LoadingSpinner label="Loading profile" />
            </div>
          ) : loadError ? (
            <Alert variant="error">{loadError}</Alert>
          ) : (
            <>
              {justSaved && (
                <div className="mb-5">
                  <Alert variant="success">Profile updated.</Alert>
                </div>
              )}
              <RecipientProfileForm
                initialData={profile}
                onSaved={handleSaved}
                submitLabel="Save changes"
              />
            </>
          )}
        </CardBody>
      </Card>
    </section>
  );
}