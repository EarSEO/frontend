import { BaseResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const resetPasswordApi = async (
  email: string,
  newPassword: string,
): Promise<void> => {
  try {
    await api.post<BaseResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      newPassword,
    });
    return;
  } catch (error) {
    throw error;
  }
};

export default resetPasswordApi;
