import axios from "axios";

/* AXIOS INSTANCE (SINGLE SOURCE OF TRUTH) */
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 15000, // ⏱️ prevent hanging requests
});

/* REQUEST INTERCEPTOR */
API.interceptors.request.use(
  (config) => {
    let token = null;

    try {
      token = localStorage.getItem("token");
    } catch {
      token = null;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
      status: error?.response?.status || 500,
    };

    return Promise.reject(normalizedError);
  }
);

export default API;
