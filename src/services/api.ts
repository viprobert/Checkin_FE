import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3500",
  timeout: 20000,
});

// optional: if you later add whitelist token/header etc.
// api.interceptors.request.use((config) => {
//   config.headers["x-admin-token"] = "....";
//   return config;
// });
