// hooks/useAxios.ts
import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { useMemo } from "react";
import { UserAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../services/api";
import { getAuth } from "firebase/auth";

const useAxios = (): AxiosInstance => {
  const { accessToken } = UserAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
      timeout: 3000000, // 5  minutes timeout
    });

    // Request interceptor to always attach the latest Firebase ID token
    instance.interceptors.request.use(
      async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const token = await user.getIdToken();
          if (!config.headers) {
            config.headers = {};
          }
          (config.headers as any).Authorization = `Bearer ${token}`;
        } else if (config.headers) {
          // If there's no user, ensure we don't send a stale token
          delete (config.headers as any).Authorization;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as
          | (AxiosRequestConfig & { _retry?: boolean })
          | undefined;

        // Handle 401 Unauthorized errors with possible token refresh
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          const data: any = error.response.data;
          const message: string | undefined =
            (typeof data === "string" && data) || data?.message || data?.error;

          if (
            message &&
            message
              .toLowerCase()
              .includes("invalid or expired authentication token")
          ) {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
              try {
                const newToken = await user.getIdToken(true); // force refresh
                originalRequest._retry = true;
                originalRequest.headers = originalRequest.headers || {};
                (
                  originalRequest.headers as any
                ).Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);
              } catch (refreshError) {
                console.error("Failed to refresh auth token", refreshError);
              }
            }
          }
        }

        // TEMPORARILY DISABLED: Premium check for Founder Essentials
        // All users can access Founder Essentials for now
        // TODO: Re-enable when premium feature is returned
        /* Handle 403 Forbidden errors - check if it's a premium requirement
        if (error.response?.status === 403) {
          const data: any = error.response.data;
          const message: string | undefined =
            (typeof data === "string" && data) ||
            data?.message ||
            data?.error;

          if (
            message &&
            (message.toLowerCase().includes("premium") ||
              message.toLowerCase().includes("upgrade") ||
              message.toLowerCase().includes("founder essentials"))
          ) {
            // Trigger premium modal
            if (premiumModalCallback) {
              premiumModalCallback();
            }
          }
        }
        */

        // Handle server errors
        if (error.response && error.response.status >= 500) {
          console.error("Server error:", error.response.status);
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken]);

  return axiosInstance;
};

export default useAxios;
