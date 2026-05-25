import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
      

        const refreshRes = await axios.post(
          "http://localhost:3000/api/v1/user/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.data.accessToken;

        

        // ✅ SAVE TOKEN
        localStorage.setItem("accessToken", newToken);

        // ✅ IMPORTANT: update axios default header
        adminApi.defaults.headers.common.Authorization =
          `Bearer ${newToken}`;

        // ✅ also update retry request
        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return adminApi(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "http://localhost:5174";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;