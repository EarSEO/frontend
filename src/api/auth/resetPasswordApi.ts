import axios from "axios";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const resetPasswordApi = async (email: string, newPassword: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, newPassword });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const code = error.response?.data?.status || "UNKNOWN";
      const message = error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      throw new ApiError(code, message);
    }
    throw error;
  }
};

export default resetPasswordApi;