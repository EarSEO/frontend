import { BaseResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const verifyEmailCodeApi = async (email: string, code: string): Promise<void> => {
  try {
    await api.post<BaseResponse<void>>(
      API_ENDPOINTS.AUTH.EMAIL_VERIFY,
      { email, code }
    );
    return;
  } catch (error) {
    throw error;
  }
};

export default verifyEmailCodeApi;