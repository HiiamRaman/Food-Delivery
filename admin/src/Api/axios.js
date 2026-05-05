import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000", // your backend
});

//add token to every request

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.replace("http://localhost:5173"); // redirect to main app
    }
    return Promise.reject(error);
  },
);

export default api;
