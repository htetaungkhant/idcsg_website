import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds common headers
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    // config.headers.Authorization = `Bearer ${token}`
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirecting to login...");

      // Auto-logout and redirect to login
      await signOut({
        callbackUrl: "/admin/sign-in",
        redirect: true,
      });

      return Promise.reject(new Error("Unauthorized - logged out"));
    }

    // Handle other errors normally
    return Promise.reject(error);
  }
);

export default apiClient;
