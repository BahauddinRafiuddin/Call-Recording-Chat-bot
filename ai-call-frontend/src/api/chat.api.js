import axiosInstance from "./axios.api";

export const askQuestion = (data) => {
  return axiosInstance.post("/chat/ask", data);
};