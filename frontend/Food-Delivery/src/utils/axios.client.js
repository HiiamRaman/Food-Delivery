import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL
// ========================
// MAIN API INSTANCE
// ========================
const api = axios.create({
  baseURL:API_URL,
  withCredentials: true,
});

// ========================
// REFRESH INSTANCE
// No interceptors here
// ========================
const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// REFRESH CONTROL
// ========================
let refreshPromise = null;

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Not a 401
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry refresh endpoint itself
    if (originalRequest?.url?.includes("/user/refresh-token")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Only ONE refresh request can run at a time
      if (!refreshPromise) {
        refreshPromise = refreshApi
          .post("/user/refresh-token")
          .then((response) => {
            const newToken = response.data?.data?.accessToken;

            if (!newToken || newToken === "undefined") {
              throw new Error("Refresh endpoint did not return an access token");
            }

            localStorage.setItem("accessToken", newToken);

            api.defaults.headers.common.Authorization =
              `Bearer ${newToken}`;

            return newToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;

      // Put new access token on failed request
      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Refresh token failed:",
        refreshError.response?.data || refreshError.message
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(refreshError);
    }
  }
);

export default api;
