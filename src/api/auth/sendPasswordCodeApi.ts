import { BaseResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const sendPasswordCodeApi = async (email: string): Promise<void> => {
  try {
    await api.post<BaseResponse<void>>(API_ENDPOINTS.AUTH.EMAIL_PASSWORD_SEND, {
      email,
    });
    return;
  } catch (error) {
    throw error;
  }
};

export default sendPasswordCodeApi;
