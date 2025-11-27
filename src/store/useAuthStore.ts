import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

import {
  LoginRequest,
  LoginResponse,
  Provider,
  SignUpRequest,
  SignUpResponse,
  SocialLoginResponse,
  SocialSignUpRequest,
  User,
} from "../types/auth";

interface AuthState {
  user: User | null;
  isLogined: boolean;
  isLoading: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignUpRequest) => Promise<SignUpResponse>;
  socialLogin: (
    provider: Provider,
    authCode: string,
  ) => Promise<SocialLoginResponse>;
  socialSignup: (userData: SocialSignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLogined: false,
  isLoading: false,

  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true });

      const response = await api.post<LoginResponse>(
        `${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials,
      );
      const { accessToken, refreshToken, memberId, email, nickname, role } =
        response.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      const user: User = { memberId, email, nickname, role };
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      set({
        user,
        isLogined: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isLogined: false,
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (userData: SignUpRequest) => {
    try {
      set({ isLoading: true });
      const response = await api.post<SignUpResponse>(
        `${API_ENDPOINTS.AUTH.SIGNUP}`,
        userData,
      );

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ user: null, isLogined: false, isLoading: false });
      throw error;
    }
  },

  socialLogin: async (provider: Provider, authCode: string) => {
    try {
      set({ isLoading: true });

      const response = await api.post<SocialLoginResponse>(
        `${API_ENDPOINTS.AUTH.SOCIAL_LOGIN}`,
        { authCode },
      );

      const data = response.data;

      if (data.isNewMember) {
        set({ isLoading: false });
        return data;
      } else if (
        data.accessToken &&
        data.refreshToken &&
        data.memberId &&
        data.nickname &&
        data.role
      ) {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);

        const user: User = {
          memberId: data.memberId,
          email: data.email,
          nickname: data.nickname,
          role: data.role,
        };
        await SecureStore.setItemAsync("user", JSON.stringify(user));

        set({
          user,
          isLogined: true,
          isLoading: false,
        });
      }
      return data;
    } catch (error) {
      set({ user: null, isLogined: false, isLoading: false });
      throw error;
    }
  },

  socialSignup: async (userData: SocialSignUpRequest) => {
    try {
      set({ isLoading: true });

      const response = await api.post<LoginResponse>(
        `${API_ENDPOINTS.AUTH.SOCIAL_SIGNUP}`,
        userData,
      );
      const { accessToken, refreshToken, memberId, email, nickname, role } =
        response.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      const user: User = { memberId, email, nickname, role };
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      set({
        user,
        isLogined: true,
        isLoading: false,
      });
    } catch (error) {
      set({ user: null, isLogined: false, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post(`${API_ENDPOINTS.AUTH.LOGOUT}`);
    } catch {
    } finally {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");

      set({
        user: null,
        isLogined: false,
      });
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });

      const userString = await SecureStore.getItemAsync("user");
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (userString && accessToken) {
        const user: User = JSON.parse(userString);
        set({
          user,
          isLogined: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false, isLogined: false });
      }
    } catch {
      set({ user: null, isLogined: false, isLoading: false });
    }
  },
}));
