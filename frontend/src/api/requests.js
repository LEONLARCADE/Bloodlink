import apiClient from "./client";

// -- Donor endpoints ---------------------------------------------------

export const fetchDonorDashboard = async () => {
  const { data } = await apiClient.get("/requests/donor/dashboard");
  return data;
};

export const fetchIncomingRequests = async () => {
  const { data } = await apiClient.get("/requests/donor/incoming");
  return data.requests;
};

export const respondToRequest = async (requestId, status, note) => {
  const { data } = await apiClient.post(`/requests/donor/${requestId}/respond`, {
    status,
    note,
  });
  return data.response;
};

export const fetchDonorHistory = async () => {
  const { data } = await apiClient.get("/requests/donor/history");
  return data;
};

// -- Recipient endpoints -------------------------------------------------

export const createRequest = async (payload) => {
  const { data } = await apiClient.post("/requests", payload);
  return data.request;
};

export const fetchMyRequests = async () => {
  const { data } = await apiClient.get("/requests/mine");
  return data.requests;
};

export const fetchRequestDetails = async (requestId) => {
  const { data } = await apiClient.get(`/requests/${requestId}`);
  return data.request;
};

export const updateMyRequest = async (requestId, payload) => {
  const { data } = await apiClient.patch(`/requests/${requestId}`, payload);
  return data.request;
};

export const cancelMyRequest = async (requestId) => {
  const { data } = await apiClient.post(`/requests/${requestId}/cancel`);
  return data.request;
};