import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // or your real backend port
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.replace("http://localhost:5173");
    }

    return Promise.reject(error);
  }
);

export default api;