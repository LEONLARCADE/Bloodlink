import { useEffect, useState } from "react";
import { Inbox, Plus, MapPin, Building2, User as UserIcon, Pencil, XCircle, ChevronDown, ChevronUp, Phone } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardBody, Badge, Alert, LoadingSpinner, Button, Modal } from "../../components/ui";
import RequestForm from "../../components/requests/RequestForm";
import {
  fetchMyRequests,
  createRequest,
  updateMyRequest,
  cancelMyRequest,
  fetchRequestDetails,
} from "../../api/requests";
import {
  bloodGroupLabel,
  URGENCY_LABELS,
  URGENCY_BADGE_VARIANTS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_BADGE_VARIANTS,
  RESPONSE_STATUS_LABELS,
  RESPONSE_STATUS_BADGE_VARIANTS,
  EDITABLE_REQUEST_STATUSES,
} from "../../constants";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function RecipientRequests() {
  useDocumentTitle("My Requests");
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [modalMode, setModalMode] = useState(null); // "create" | "edit" | null
  const [editingRequest, setEditingRequest] = useState(null);

  const [expandedId, setExpandedId] = useState(null);
  const [detailsById, setDetailsById] = useState({}); // requestId -> full request w/ responses
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [cancellingId, setCancellingId] = useState(null);
  const [rowError, setRowError] = useState("");

  const load = () => {
    setIsLoading(true);
    setLoadError("");
    fetchMyRequests()
      .then((data) => setRequests(data))
      .catch((err) => setLoadError(err.message || "Couldn't load your requests"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingRequest(null);
    setModalMode("create");
  };

  const openEdit = (request) => {
    setEditingRequest(request);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingRequest(null);
  };

  const handleCreated = () => {
    closeModal();
    load();
  };

  const handleUpdated = () => {
    closeModal();
    load();
    if (expandedId) {
      setDetailsById((prev) => {
        const next = { ...prev };
        delete next[expandedId];
        return next;
      });
    }
  };

  const handleToggleExpand = async (requestId) => {
    if (expandedId === requestId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(requestId);
    setRowError("");
    if (!detailsById[requestId]) {
      setDetailsLoading(true);
      try {
        const details = await fetchRequestDetails(requestId);
        setDetailsById((prev) => ({ ...prev, [requestId]: details }));
      } catch (err) {
        setRowError(err.message || "Couldn't load responses");
      } finally {
        setDetailsLoading(false);
      }
    }
  };

  const handleCancel = async (requestId) => {
    setCancellingId(requestId);
    setRowError("");
    try {
      const updated = await cancelMyRequest(requestId);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: updated.status } : r)));
    } catch (err) {
      setRowError(err.message || "Couldn't cancel this request");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section>
      <PageHeader
        title="My Requests"
        description="Create, track and manage your blood requests."
        icon={Inbox}
        actions={
          <Button leftIcon={Plus} onClick={openCreate}>
            New Request
          </Button>
        }
      />

      {rowError && (
        <div className="mb-4">
          <Alert variant="error" onDismiss={() => setRowError("")}>
            {rowError}
          </Alert>
        </div>
      )}

      {isLoading ? (
        <Card>
          <CardBody className="py-10">
            <LoadingSpinner label="Loading requests" />
          </CardBody>
        </Card>
      ) : loadError ? (
        <Alert variant="error">{loadError}</Alert>
      ) : requests.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center">
            <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-4">You haven't created any requests yet.</p>
            <Button leftIcon={Plus} onClick={openCreate}>
              Create your first request
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isEditable = EDITABLE_REQUEST_STATUSES.includes(req.status);
            const isExpanded = expandedId === req.id;
            const details = detailsById[req.id];

            return (
              <Card key={req.id}>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-primary">
                          {bloodGroupLabel(req.bloodGroup)}
                        </span>
                        <Badge variant={URGENCY_BADGE_VARIANTS[req.urgency]}>
                          {URGENCY_LABELS[req.urgency]}
                        </Badge>
                        <Badge variant={REQUEST_STATUS_BADGE_VARIANTS[req.status]}>
                          {REQUEST_STATUS_LABELS[req.status]}
                        </Badge>
                        <Badge variant="default">
                          {req.unitsRequired} unit{req.unitsRequired > 1 ? "s" : ""}
                        </Badge>
                      </div>

                      <dl className="mt-2 space-y-1 text-sm text-gray-600">
                        {req.hospitalName && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {req.hospitalName}
                          </div>
                        )}
                        {req.patientName && (
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                            Patient: {req.patientName}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {req.district}
                        </div>
                        {req.neededBy && (
                          <div className="text-gray-500">Needed by {formatDate(req.neededBy)}</div>
                        )}
                        {req.notes && <div className="text-gray-500 italic">"{req.notes}"</div>}
                      </dl>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        {isEditable && (
                          <Button size="sm" variant="secondary" leftIcon={Pencil} onClick={() => openEdit(req)}>
                            Edit
                          </Button>
                        )}
                        {isEditable && (
                          <Button
                            size="sm"
                            variant="danger"
                            leftIcon={XCircle}
                            isLoading={cancellingId === req.id}
                            onClick={() => handleCancel(req.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleExpand(req.id)}
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {req._count?.responses ?? 0} response
                        {(req._count?.responses ?? 0) === 1 ? "" : "s"}
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {!details ? (
                        detailsLoading ? (
                          <LoadingSpinner size="sm" label="Loading responses" />
                        ) : null
                      ) : details.responses.length === 0 ? (
                        <p className="text-sm text-gray-500">No donor responses yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {details.responses.map((r) => (
                            <li
                              key={r.id}
                              className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    {bloodGroupLabel(r.donor.bloodGroup)} donor
                                  </span>
                                  <Badge variant={RESPONSE_STATUS_BADGE_VARIANTS[r.status]}>
                                    {RESPONSE_STATUS_LABELS[r.status]}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {r.donor.district}
                                </p>
                                {r.donor.user && (
                                  <p className="mt-1 text-xs text-gray-600 flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {r.donor.user.fullName}
                                    {r.donor.user.phone ? ` · ${r.donor.user.phone}` : ""}
                                  </p>
                                )}
                                {r.note && (
                                  <p className="mt-1 text-xs text-gray-500 italic">"{r.note}"</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === "edit" ? "Edit Request" : "New Blood Request"}
        size="lg"
      >
        <RequestForm
          initialData={modalMode === "edit" ? editingRequest : null}
          submitLabel={modalMode === "edit" ? "Save changes" : "Create request"}
          onSubmit={(payload) =>
            modalMode === "edit" ? updateMyRequest(editingRequest.id, payload) : createRequest(payload)
          }
          onSuccess={modalMode === "edit" ? handleUpdated : handleCreated}
        />
      </Modal>
    </section>
  );
}