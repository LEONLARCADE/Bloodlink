import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Droplet,
  MapPin,
  Inbox,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody, Badge, Alert, LoadingSpinner, Button } from "../../components/ui";
import { fetchDonorDashboard } from "../../api/requests";
import { bloodGroupLabel, URGENCY_LABELS, URGENCY_BADGE_VARIANTS, ROUTES } from "../../constants";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function DonorDashboard() {
  useDocumentTitle("Donor Dashboard");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchDonorDashboard()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setLoadError(err.message || "Couldn't load your dashboard");
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
        title="Donor Dashboard"
        description="Eligibility status, upcoming donations and nearby requests at a glance."
        icon={LayoutDashboard}
      />

      {isLoading ? (
        <Card>
          <CardBody className="py-10">
            <LoadingSpinner label="Loading dashboard" />
          </CardBody>
        </Card>
      ) : loadError ? (
        <Alert variant="error">{loadError}</Alert>
      ) : !data?.hasProfile ? (
        <Card>
          <CardBody className="flex flex-col items-start gap-3">
            <Alert variant="warning" title="Complete your donor profile">
              We need your blood group and district before we can show eligibility or match you
              with nearby requests.
            </Alert>
            <Button as={Link} to={ROUTES.DONOR.PROFILE} rightIcon={ArrowRight}>
              Complete profile
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <EligibilityCard eligibility={data.eligibility} />
            <StatCard
              icon={Droplet}
              label="Completed donations"
              value={data.stats.totalDonations}
            />
            <StatCard
              icon={Inbox}
              label="Nearby open requests"
              value={data.stats.nearbyRequestsCount}
            />
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Nearby requests matching your profile</CardTitle>
              <Link
                to={ROUTES.DONOR.REQUESTS}
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {data.nearbyRequests.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No open requests currently match your blood group ({bloodGroupLabel(data.profile.bloodGroup)}) in{" "}
                  {data.profile.district}. We'll match you as soon as one comes in.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.nearbyRequests.map((req) => (
                    <li key={req.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {bloodGroupLabel(req.bloodGroup)}
                          </span>
                          <Badge variant={URGENCY_BADGE_VARIANTS[req.urgency]}>
                            {URGENCY_LABELS[req.urgency]}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {req.hospitalName || req.district}
                          {req.neededBy && ` · needed by ${formatDate(req.neededBy)}`}
                        </p>
                      </div>
                      <Badge variant="default">
                        {req.unitsRequired} unit{req.unitsRequired > 1 ? "s" : ""}
                      </Badge>
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

function EligibilityCard({ eligibility }) {
  const isEligible = eligibility?.isEligible;
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {isEligible ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <Clock className="w-4 h-4 text-amber-500" />
          )}
          Eligibility
        </div>
        <p
          className={`mt-1 text-lg font-bold ${
            isEligible ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {isEligible
            ? "Eligible to donate"
            : `Eligible in ${eligibility.daysRemaining} day${
                eligibility.daysRemaining === 1 ? "" : "s"
              }`}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {eligibility.nextEligibleDate
            ? `Next eligible date: ${formatDate(eligibility.nextEligibleDate)}`
            : "No previous donation on record"}
        </p>
      </CardBody>
    </Card>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon className="w-4 h-4 text-primary" />
          {label}
        </div>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </CardBody>
    </Card>
  );
}