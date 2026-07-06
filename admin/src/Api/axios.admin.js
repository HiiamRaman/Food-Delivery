import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
adminApi.interceptors.request.use(
  (config) => {
  

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
adminApi.interceptors.response.use(
  (response) => {
    
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

   
    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Access token expired. Refreshing...");

        const refreshRes = await axios.post(
          "http://localhost:3000/api/v1/user/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        console.log("✅ Refresh Successful");
        console.log("Refresh Response:", refreshRes.data);

        console.log("🔁 Retrying original request...");

        return adminApi(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh Failed");
        console.error("Status:", refreshError.response?.status);
        console.error("Response:", refreshError.response?.data);

        // Redirect to login
        window.location.href = "http://localhost:5174";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;