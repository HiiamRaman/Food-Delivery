import axios from "axios";

// ========================
// MAIN API INSTANCE
// ========================
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ========================
// SEPARATE INSTANCE (NO INTERCEPTORS)
// ========================
const refreshApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ========================
// ATTACH ACCESS TOKEN
// ========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ========================
// REFRESH CONTROL FLAGS
// ========================
let isRefreshing = false;
let refreshQueue = [];

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401 → just fail
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent refresh endpoint loop
    if (originalRequest.url === "/user/refresh-token") {
      localStorage.removeItem("accessToken");
      window.location.href = "http://localhost:5173";
      return Promise.reject(error);
    }

    // Prevent infinite retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // ========================
    // If already refreshing → queue request
    // ========================
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => {
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // ========================
      // REFRESH TOKEN CALL
      // ========================
      const res = await refreshApi.post("/user/refresh-token", {});

      const newAccessToken = res.data.data.accessToken;

      // Save token
      localStorage.setItem("accessToken", newAccessToken);

      // Update default header for future requests
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      isRefreshing = false;

      // Process queued requests
      refreshQueue.forEach((cb) => cb());
      refreshQueue = [];

      // Retry original request
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      refreshQueue = [];

      localStorage.removeItem("accessToken");

      window.location.href = "http://localhost:5173";

      return Promise.reject(err);
    }
  }
);

export default api;