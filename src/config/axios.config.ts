import axios from "axios";
import { getFromLocalStorage } from "@/utils/webstorage.utls";

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getFromLocalStorage("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// function to create a customized instance with additional header configs
export const apiWithHeaders = (headers: Record<string, string>) => {
  return axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
      ...api.defaults.headers,
      ...headers,
    },
  });
};

export default api;
