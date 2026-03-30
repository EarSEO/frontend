import { APP_ENV_API_BASE_URL } from '@env'
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

import { RefreshTokenResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

const API_BASE_URL = APP_ENV_API_BASE_URL;
const REFRESH_URL = API_ENDPOINTS.AUTH.REFRESH;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 갱신 중복 방지
let isRefreshing = false;
let waitingRequest: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  waitingRequest.forEach((callback) => callback(token));
  waitingRequest = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  waitingRequest.push(callback);
};

// 요청 인터셉터
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await SecureStore.getItem("accessToken");

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 인증 불필요 API는 refresh 시도하지 않음
    const NO_AUTH_URLS = [
      API_ENDPOINTS.AUTH.SOCIAL_LOGIN_APPLE,
      // API_ENDPOINTS.AUTH.SOCIAL_LOGIN_GOOGLE,
      API_ENDPOINTS.AUTH.SOCIAL_SIGNUP,
    ];
    const requestUrl = originalRequest.url || "";
    const isNoAuthRequest = NO_AUTH_URLS.some(url => requestUrl.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !isNoAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}${REFRESH_URL}`,
          { refreshToken },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        await SecureStore.setItemAsync("accessToken", newAccessToken);
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);

        onRefreshed(newAccessToken);

        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("user");

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
