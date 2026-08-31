import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

adminApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/user/refresh-token")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post(
        `${BASE_URL}/user/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      );

      const newAccessToken =
        refreshResponse.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("No new access token returned");
      }

      localStorage.setItem("adminToken", newAccessToken);

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return adminApi(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  },
);

export default adminApi;
