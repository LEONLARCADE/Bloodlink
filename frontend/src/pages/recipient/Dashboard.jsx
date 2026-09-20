import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Inbox, Clock, CheckCircle2, ArrowRight, Plus, MapPin } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody, Badge, Alert, LoadingSpinner, Button } from "../../components/ui";
import { fetchMyRequests } from "../../api/requests";
import {
  bloodGroupLabel,
  URGENCY_LABELS,
  URGENCY_BADGE_VARIANTS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_BADGE_VARIANTS,
  ROUTES,
} from "../../constants";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const ACTIVE_STATUSES = ["OPEN", "IN_PROGRESS"];

export default function RecipientDashboard() {
  useDocumentTitle("Recipient Dashboard");
  const [requests, setRequests] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchMyRequests()
      .then((data) => {
        if (isMounted) setRequests(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.status === 409) {
          setNeedsProfile(true);
        } else {
          setLoadError(err.message || "Couldn't load your dashboard");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const active = requests?.filter((r) => ACTIVE_STATUSES.includes(r.status)) || [];
  const fulfilled = requests?.filter((r) => r.status === "FULFILLED") || [];
  const totalResponses = requests?.reduce((sum, r) => sum + (r._count?.responses || 0), 0) || 0;

  return (
    <section>
      <PageHeader
        title="Recipient Dashboard"
        description="Active requests, donor responses and request status overview."
        icon={LayoutDashboard}
        actions={
          !needsProfile && (
            <Button as={Link} to={ROUTES.RECIPIENT.REQUESTS} leftIcon={Plus}>
              New Request
            </Button>
          )
        }
      />

      {isLoading ? (
        <Card>
          <CardBody className="py-10">
            <LoadingSpinner label="Loading dashboard" />
          </CardBody>
        </Card>
      ) : needsProfile ? (
        <Card>
          <CardBody className="flex flex-col items-start gap-3">
            <Alert variant="warning" title="Complete your recipient profile">
              We need your district before you can create a blood request.
            </Alert>
            <Button as={Link} to={ROUTES.RECIPIENT.PROFILE} rightIcon={ArrowRight}>
              Complete profile
            </Button>
          </CardBody>
        </Card>
      ) : loadError ? (
        <Alert variant="error">{loadError}</Alert>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Clock} label="Active requests" value={active.length} />
            <StatCard icon={CheckCircle2} label="Fulfilled requests" value={fulfilled.length} />
            <StatCard icon={Inbox} label="Total donor responses" value={totalResponses} />
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Active requests</CardTitle>
              <Link
                to={ROUTES.RECIPIENT.REQUESTS}
                className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {active.length === 0 ? (
                <div className="p-8 text-center">
                  <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-4">No active requests right now.</p>
                  <Button as={Link} to={ROUTES.RECIPIENT.REQUESTS} leftIcon={Plus}>
                    Create a request
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {active.slice(0, 5).map((req) => (
                    <li key={req.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {bloodGroupLabel(req.bloodGroup)}
                          </span>
                          <Badge variant={URGENCY_BADGE_VARIANTS[req.urgency]}>
                            {URGENCY_LABELS[req.urgency]}
                          </Badge>
                          <Badge variant={REQUEST_STATUS_BADGE_VARIANTS[req.status]}>
                            {REQUEST_STATUS_LABELS[req.status]}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {req.hospitalName || req.district}
                          {req.neededBy && ` · needed by ${formatDate(req.neededBy)}`}
                        </p>
                      </div>
                      <Badge variant="default">
                        {req._count?.responses ?? 0} response
                        {(req._count?.responses ?? 0) === 1 ? "" : "s"}
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