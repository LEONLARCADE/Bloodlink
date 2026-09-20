import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History, Droplet, Clock, CheckCircle2, ArrowRight, MapPin } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody, Badge, Alert, LoadingSpinner, Button } from "../../components/ui";
import { fetchDonorHistory } from "../../api/requests";
import { bloodGroupLabel, ROUTES } from "../../constants";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function DonorHistory() {
  useDocumentTitle("Donation History");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchDonorHistory()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.status === 409) {
          setNeedsProfile(true);
        } else {
          setLoadError(err.message || "Couldn't load your donation history");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <PageHeader
        title="Donation History"
        description="Every completed donation, with dates and next eligible donation date."
        icon={History}
      />

      {isLoading ? (
        <Card>
          <CardBody className="py-10">
            <LoadingSpinner label="Loading history" />
          </CardBody>
        </Card>
      ) : needsProfile ? (
        <Card>
          <CardBody className="flex flex-col items-start gap-3">
            <Alert variant="warning" title="Complete your donor profile">
              We need your profile set up before we can show your donation history.
            </Alert>
            <Button as={Link} to={ROUTES.DONOR.PROFILE} rightIcon={ArrowRight}>
              Complete profile
            </Button>
          </CardBody>
        </Card>
      ) : loadError ? (
        <Alert variant="error">{loadError}</Alert>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardBody className="flex items-center gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-light shrink-0">
                {data.eligibility.isEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600" />
                )}
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  {data.eligibility.isEligible
                    ? "You're eligible to donate now"
                    : `Next eligible in ${data.eligibility.daysRemaining} day${
                        data.eligibility.daysRemaining === 1 ? "" : "s"
                      }`}
                </p>
                <p className="text-sm text-gray-500">
                  {data.eligibility.lastDonationDate
                    ? `Last donation: ${formatDate(data.eligibility.lastDonationDate)} · `
                    : ""}
                  {data.eligibility.nextEligibleDate
                    ? `Next eligible date: ${formatDate(data.eligibility.nextEligibleDate)}`
                    : "No previous donation on record"}
                </p>
              </div>
            </CardBody>
          </Card>

          {data.upcoming.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming (accepted, not yet completed)</CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <ul className="divide-y divide-gray-100">
                  {data.upcoming.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {bloodGroupLabel(item.request.bloodGroup)}{" "}
                          <span className="font-normal text-gray-500">
                            · {item.request.hospitalName || item.request.district}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.request.district}
                        </p>
                      </div>
                      <Badge variant="success">Accepted</Badge>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Completed donations</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              {data.completed.length === 0 ? (
                <div className="p-8 text-center">
                  <Droplet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No completed donations yet. Accepted requests will show up here once marked
                    complete.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.completed.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {bloodGroupLabel(item.request.bloodGroup)}{" "}
                          <span className="font-normal text-gray-500">
                            · {item.request.hospitalName || item.request.district}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Donated on {formatDate(item.completedAt)}
                        </p>
                      </div>
                      <Badge variant="primary">Completed</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </section>
  );
}