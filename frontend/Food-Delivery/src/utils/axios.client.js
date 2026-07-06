import axios from "axios";

// ========================
// MAIN API INSTANCE
// ========================
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ========================
// REFRESH INSTANCE (NO INTERCEPTORS)
// ========================
const refreshApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  console.log("🚀 REQUEST:", config.url, "| TOKEN:", token);

  return config;
});

// ========================
// REFRESH CONTROL
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

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // 🚨 prevent refresh loop
    if (originalRequest.url?.includes("/user/refresh-token")) {
      localStorage.removeItem("accessToken");
      window.location.href = "http://localhost:5173";
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.log("🔄 Refreshing token...");

      const res = await refreshApi.post("/user/refresh-token");

      const newToken = res.data?.data?.accessToken;

      if (!newToken || newToken === "undefined") {
        throw new Error("Invalid refreshed token");
      }

      console.log("✅ New token received:", newToken);

      // store token
      localStorage.setItem("accessToken", newToken);

      // update default axios header
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      // 🔥 IMPORTANT: rebuild request fully
      return api({
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });

    } catch (err) {
      console.log("❌ Refresh failed");

      localStorage.removeItem("accessToken");

      window.location.href = "http://localhost:5173";

      return Promise.reject(err);
    }
  }
);

export default api;