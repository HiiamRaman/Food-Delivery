import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // IMPORTANT for refresh cookie
});

// --------------------
// Attach access token
// --------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --------------------
// Auto refresh on 401
// --------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh endpoint
        const res = await api.post(
          "/user/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;

        // store new token
        localStorage.setItem("accessToken", newAccessToken);

        // update original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // retry request
        return api(originalRequest);

      } catch (err) {
        // refresh failed → logout user
        localStorage.removeItem("accessToken");

        window.location.href = "http://localhost:5173";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;