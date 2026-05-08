import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// -----------------------------
// Attach Access Token
// -----------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -----------------------------
// Refresh Token Control
// -----------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// -----------------------------
// Response Interceptor (CORE LOGIC)
// -----------------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If no response → network error
    if (!error.response) {
      return Promise.reject(error);
    }

    // If refresh endpoint fails → logout
    if (originalRequest.url.includes("/refresh-token")) {
      localStorage.removeItem("accessToken");
      window.location.href = "http://localhost:5173";
      return Promise.reject(error);
    }

    // -----------------------------
    // Handle expired token (401)
    // -----------------------------
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing → queue requests
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // Call refresh API
        const res = await axios.post(
          "http://localhost:3000/api/v1/user/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newToken);

        // Update default header
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        processQueue(null, newToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("accessToken");

        window.location.href = "http://localhost:5173";

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;