import axios from "axios";

/**
 * Base URL comes from the environment only. Never hard-code hosts or ports.
 * Local dev  -> VITE_API_URL=http://localhost:5000
 * Production -> set VITE_API_URL in the Vercel project settings.
 *
 * Only non-secret, public configuration belongs in VITE_ variables:
 * they are inlined into the client bundle at build time.
 */
const rawBaseUrl = import.meta.env.VITE_API_URL ?? "";
const baseURL = `${rawBaseUrl.replace(/\/+$/, "")}/api`;

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn(
    "[BloodLink] VITE_API_URL is not set. Requests will be sent relative to the current origin."
  );
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  // Enable when the backend issues httpOnly cookies (later phase):
  // withCredentials: true,
});

/**
 * Request interceptor.
 * Token attachment is intentionally left out until the auth phase.
 */
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: unwrap data, normalise errors into a single shape
 * so components never have to inspect raw Axios errors.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalised = {
      status: error.response?.status ?? null,
      message:
        error.response?.data?.message ??
        error.message ??
        "Unexpected network error.",
      data: error.response?.data ?? null,
      isNetworkError: !error.response,
    };
    return Promise.reject(normalised);
  }
);

/** Convenience wrappers returning response.data directly. */
export const http = {
  get: (url, config) => api.get(url, config).then((r) => r.data),
  post: (url, body, config) => api.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => api.put(url, body, config).then((r) => r.data),
  patch: (url, body, config) => api.patch(url, body, config).then((r) => r.data),
  delete: (url, config) => api.delete(url, config).then((r) => r.data),
};

export { baseURL as API_BASE_URL };
export default api;