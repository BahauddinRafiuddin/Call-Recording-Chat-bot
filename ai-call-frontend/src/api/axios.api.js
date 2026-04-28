import axios from "axios";
import { getUserId } from "../utils/user";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const userId = getUserId();

  if (!userId) {
    console.error("User ID missing!");
  }

  config.headers["x-user-id"] = userId;
  return config;
});

export default axiosInstance;