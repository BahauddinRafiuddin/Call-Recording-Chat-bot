import axiosInstance from "./axios.api";

export const uploadCall = (formData) => {
  return axiosInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCalls = () => {
  return axiosInstance.get("/calls");
};

export const deleteCall = (id) => {
  return axiosInstance.delete(`/calls/${id}`);
};