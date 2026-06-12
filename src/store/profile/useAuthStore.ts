import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import {
  PasswordUpdateRequest,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
} from "@/types/member";

import API_ENDPOINTS from "@/constants/endpoints";

import appleLoginApi from "@/api/auth/appleLoginApi";
import socialSignupApi from "@/api/auth/socialSignupApi";
import api from "@/api/axios";

import {
  BaseResponse,
  LoginRequest,
  LoginResponse,
  Provider,
  SignUpRequest,
  SignUpResponse,
  SocialLoginResponse,
  SocialSignUpRequest,
  User,
} from "../../types/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO } from "./secureStoreKey";

interface AuthState {
  user: User | null;
  isLogined: boolean;
  isLoading: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignUpRequest) => Promise<SignUpResponse>;

  googleLogin: (idToken: string) => Promise<SocialLoginResponse>;
  socialSignup: (userData: SocialSignUpRequest) => Promise<void>;
  appleLogin: (
    identityToken: string,
    fullName?: string
  ) => Promise<SocialLoginResponse>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<ProfileUpdateResponse>;
  updateProfileImage: (file: FormData) => Promise<string>;
  updatePassword: (data: PasswordUpdateRequest) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLogined: false,
  isLoading: false,

  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true });

      const response = await api.post<BaseResponse<LoginResponse>>(
        `${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials
      );
      const { accessToken, refreshToken, memberId, email, nickname, role } =
        response.data.data;

      await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);

      const user: User = {
        memberId,
        email,
        nickname,
        role,
        updatedAt: new Date(),
        profileUrl: "",
      };
      await SecureStore.setItemAsync(USER_INFO, JSON.stringify(user));

      set({
        user,
        isLogined: true,
        isLoading: false,
      });
      await get().fetchProfile();
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
        userData
      );

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ user: null, isLogined: false, isLoading: false });
      throw error;
    }
  },

  googleLogin: async (idToken: string): Promise<SocialLoginResponse> => {
    try {
      set({ isLoading: true });

      const response = await api.post<BaseResponse<SocialLoginResponse>>(
        API_ENDPOINTS.AUTH.SOCIAL_LOGIN_GOOGLE,
        { idToken }
      );

      const data = response.data.data;

      if (data.isNewMember) {
        set({ isLoading: false });
        return data;
      }

      if (data.accessToken && data.refreshToken && data.memberId) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, data.accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN, data.refreshToken);

        const user: User = {
          memberId: data.memberId,
          email: data.email,
          nickname: data.nickname || "",
          role: data.role!,
          updatedAt: new Date(),
          profileUrl: "",
        };
        await SecureStore.setItemAsync(USER_INFO, JSON.stringify(user));

        set({ user, isLogined: true, isLoading: false });
        await get().fetchProfile();
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

      const { accessToken, refreshToken, memberId, email, nickname, role } =
        await socialSignupApi(userData);

      await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);

      const user: User = {
        memberId,
        email,
        nickname,
        role,
        updatedAt: new Date(),
        profileUrl: "",
      };
      await SecureStore.setItemAsync(USER_INFO, JSON.stringify(user));

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

  appleLogin: async (
    identityToken: string,
    fullName?: string
  ): Promise<SocialLoginResponse> => {
    try {
      set({ isLoading: true });
      const data = await appleLoginApi(identityToken, fullName);

      if (data.isNewMember) {
        set({ isLoading: false });
        return data;
      }

      // 기존 회원이면 토큰 저장 및 로그인 처리
      if (data.accessToken && data.refreshToken && data.memberId) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, data.accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN, data.refreshToken);

        const user: User = {
          memberId: data.memberId,
          email: data.email,
          nickname: data.nickname || "",
          role: data.role!,
          updatedAt: new Date(),
          profileUrl: "",
        };
        await SecureStore.setItemAsync(USER_INFO, JSON.stringify(user));

        set({
          user,
          isLogined: true,
          isLoading: false,
        });

        await get().fetchProfile();
      }

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post(`${API_ENDPOINTS.AUTH.LOGOUT}`);
    } catch {
    } finally {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(USER_INFO);

      set({
        user: null,
        isLogined: false,
      });
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });

      const userString = await SecureStore.getItemAsync(USER_INFO);
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN);

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

  updateProfile: async (data: ProfileUpdateRequest) => {
    try {
      set({ isLoading: true });
      const response = await api.put<BaseResponse<ProfileUpdateResponse>>(
        API_ENDPOINTS.MEMBER.EDIT_PROFILE,
        data
      );

      const updatedProfile = response.data.data;

      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          nickname: updatedProfile.nickname,
          gender: updatedProfile.gender,
          birthdate: updatedProfile.birthdate,
          nationality: updatedProfile.nationality,
          profileImage: updatedProfile.profileImage,
        };
        await SecureStore.setItemAsync(USER_INFO, JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }

      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfileImage: async (formData: FormData) => {
    try {
      set({ isLoading: true });
      const response = await api.patch<
        BaseResponse<{ profileImageUrl: string }>
      >(API_ENDPOINTS.MEMBER.EDIT_PROFILE_IMAGE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.data.profileImageUrl;

      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          profileImage: imageUrl,
        };
        await SecureStore.setItemAsync(USER_INFO, JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
      set({ isLoading: false });
      return response.data.data.profileImageUrl;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updatePassword: async (data: PasswordUpdateRequest) => {
    try {
      set({ isLoading: true });
      await api.put<BaseResponse<void>>(
        API_ENDPOINTS.MEMBER.CHANGE_PASSWORD,
        data
      );
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProfile: async () => {
    try {
      set({ isLoading: true });

      const response = await api.get<BaseResponse<ProfileUpdateResponse>>(
        API_ENDPOINTS.MEMBER.GET_PROFILE
      );

      const profile = response.data.data;
      const currentUser = get().user;

      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          nickname: profile.nickname,
          gender: profile.gender,
          birthdate: profile.birthdate,
          nationality: profile.nationality,
          profileImage: profile.profileImage,
        };

        await SecureStore.setItemAsync(USER_INFO, JSON.stringify(updatedUser));
        set({ user: updatedUser, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
