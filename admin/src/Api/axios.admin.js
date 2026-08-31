import axios from "axios";

const BASE_URL =  import.meta.env.VITE_API_URL;

const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

adminApi.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

adminApi.interceptors.response.use(
  // ====================================================
  // SUCCESS
  // ====================================================

  (response) => {
    return response;
  },

  // ====================================================
  // ERROR
  // ====================================================

  async (error) => {
    const originalRequest = error.config;

    // If there is no original request, stop
    if (!originalRequest) {
      console.error("❌ No original request found");

      return Promise.reject(error);
    }

    // ==================================================
    // CHECK 401
    // ==================================================

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ==================================================
    // PREVENT INFINITE REFRESH LOOP
    // ==================================================

    if (originalRequest._retry) {
      console.error("❌ Request already retried.");
      console.error("❌ Not trying refresh again.");

      return Promise.reject(error);
    }

    // Mark request as retried
    originalRequest._retry = true;

    // ==================================================
    // NEVER REFRESH THE REFRESH REQUEST
    // ==================================================

    if (originalRequest.url?.includes("/user/refresh-token")) {
      window.location.href = "/";

      return Promise.reject(error);
    }

    // ==================================================
    // REFRESH TOKEN
    // ==================================================

    try {
      const refreshResponse = await axios.post(
        `${BASE_URL}/user/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      );

      // ==================================================
      // RETRY ORIGINAL REQUEST
      // ==================================================

      const retryResponse = await adminApi(originalRequest);

      return retryResponse;
    } catch (refreshError) {
      // ==================================================
      // REFRESH FAILED
      // ==================================================

      window.location.href = "/";

      return Promise.reject(refreshError);
    }
  },
);

export default adminApi;
