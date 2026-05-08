import axios from "axios";
import {io} from 'socket.io-client'
let socket;
export const connectSocket = (token) => {
  if (socket) socket.disconnect();

  socket = io("http://localhost:3000", {
    auth: { token },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// --------------------
// Attach access token
// --------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  console.log("[REQUEST] URL:", config.url);
  console.log("[REQUEST] Token exists:", !!token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --------------------
// Handle 401 globally
// --------------------
api.interceptors.response.use(
  (response) => {
    console.log("[RESPONSE SUCCESS]:", response.config.url);
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    console.log("[RESPONSE ERROR]:", error.response?.status);
    console.log("[FAILED URL]:", originalRequest?.url);

    // ONLY handle 401 once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      console.log("[REFRESH] Attempting token refresh...");

      try {
        const res = await axios.post(
          "http://localhost:3000/api/v1/user/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        console.log("[REFRESH RESPONSE]:", res.data);

        const newAccessToken = res.data.data.accessToken;

        console.log("[NEW ACCESS TOKEN]:", newAccessToken);

        localStorage.setItem("accessToken", newAccessToken);
        
               connectSocket(newAccessToken); 
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        console.log("[RETRYING ORIGINAL REQUEST]");

        return api(originalRequest);

      } catch (Refresherror) {
        console.log("[REFRESH FAILED] Logging out user");

        localStorage.removeItem("accessToken");

        window.location.replace("http://localhost:5173/Raman/");

        return Promise.reject(Refresherror);
      }
    }

    return Promise.reject(error);
  }
);

export default api;