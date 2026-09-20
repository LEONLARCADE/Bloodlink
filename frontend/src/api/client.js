import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL,
  // Required so the browser sends/receives the httpOnly auth cookie set by the backend.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalizes backend error responses ({ success: false, message, errors? })
// into a single shape so components don't need to know about axios internals.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const normalized = {
      message: data?.message || "Something went wrong. Please try again.",
      fieldErrors: data?.errors || null,
      status: error.response?.status || null,
    };
    return Promise.reject(normalized);
  }
);

export default apiClient;