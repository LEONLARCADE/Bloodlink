import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, MapPin, Check, X, ArrowRight, Building2, User as UserIcon } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardBody, Badge, Alert, LoadingSpinner, Button } from "../../components/ui";
import { fetchIncomingRequests, respondToRequest } from "../../api/requests";
import {
  bloodGroupLabel,
  URGENCY_LABELS,
  URGENCY_BADGE_VARIANTS,
  RESPONSE_STATUS_LABELS,
  RESPONSE_STATUS_BADGE_VARIANTS,
  ROUTES,
} from "../../constants";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function DonorRequests() {
  useDocumentTitle("Incoming Requests");
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [needsProfile, setNeedsProfile] = useState(false);
  const [actionState, setActionState] = useState({}); // { [requestId]: { loading, error } }

  const load = () => {
    setIsLoading(true);
    setLoadError("");
    fetchIncomingRequests()
      .then((data) => setRequests(data))
      .catch((err) => {
        if (err.status === 409) {
          setNeedsProfile(true);
        } else {
          setLoadError(err.message || "Couldn't load incoming requests");
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRespond = async (requestId, status) => {
    setActionState((prev) => ({ ...prev, [requestId]: { loading: true, error: "" } }));
    try {
      const response = await respondToRequest(requestId, status);
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, myResponse: response } : req))
      );
      setActionState((prev) => ({ ...prev, [requestId]: { loading: false, error: "" } }));
    } catch (err) {
      setActionState((prev) => ({
        ...prev,
        [requestId]: { loading: false, error: err.message || "Couldn't submit your response" },
      }));
    }
  };

  return (
    <section>
      <PageHeader
        title="Incoming Requests"
        description="Blood requests matched to your group and location, awaiting your response."
        icon={Inbox}
      />

      {isLoading ? (
        <Card>
          <CardBody className="py-10">
            <LoadingSpinner label="Loading requests" />
          </CardBody>
        </Card>
      ) : needsProfile ? (
        <Card>
          <CardBody className="flex flex-col items-start gap-3">
            <Alert variant="warning" title="Complete your donor profile">
              We match requests using your blood group and district — add these to see requests
              near you.
            </Alert>
            <Button as={Link} to={ROUTES.DONOR.PROFILE} rightIcon={ArrowRight}>
              Complete profile
            </Button>
          </CardBody>
        </Card>
      ) : loadError ? (
        <Alert variant="error">{loadError}</Alert>
      ) : requests.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center text-sm text-gray-500">
            No open requests match your blood group and district right now. We'll notify you as
            soon as one comes in.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              actionState={actionState[req.id]}
              onRespond={handleRespond}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RequestCard({ request, actionState, onRespond }) {
  const myStatus = request.myResponse?.status;
  const isPendingAction = actionState?.loading;

  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {bloodGroupLabel(request.bloodGroup)}
              </span>
              <Badge variant={URGENCY_BADGE_VARIANTS[request.urgency]}>
                {URGENCY_LABELS[request.urgency]}
              </Badge>
              <Badge variant="default">
                {request.unitsRequired} unit{request.unitsRequired > 1 ? "s" : ""}
              </Badge>
            </div>

            <dl className="mt-2 space-y-1 text-sm text-gray-600">
              {request.hospitalName && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  {request.hospitalName}
                </div>
              )}
              {request.patientName && (
                <div className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                  Patient: {request.patientName}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {request.district}
              </div>
              {request.neededBy && (
                <div className="text-gray-500">Needed by {formatDate(request.neededBy)}</div>
              )}
              {request.notes && <div className="text-gray-500 italic">"{request.notes}"</div>}
            </dl>
          </div>

          <div className="flex flex-col items-end gap-2">
            {myStatus ? (
              <Badge variant={RESPONSE_STATUS_BADGE_VARIANTS[myStatus]}>
                {RESPONSE_STATUS_LABELS[myStatus]}
              </Badge>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={Check}
                  isLoading={isPendingAction}
                  onClick={() => onRespond(request.id, "ACCEPTED")}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={X}
                  disabled={isPendingAction}
                  onClick={() => onRespond(request.id, "DECLINED")}
                >
                  Decline
                </Button>
              </div>
            )}
            {myStatus === "DECLINED" && (
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
                onClick={() => onRespond(request.id, "ACCEPTED")}
              >
                Changed your mind? Accept instead
              </button>
            )}
          </div>
        </div>

        {actionState?.error && (
          <div className="mt-3">
            <Alert variant="error">{actionState.error}</Alert>
          </div>
        )}
      </CardBody>
    </Card>
  );
}