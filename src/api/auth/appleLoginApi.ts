import axios from "axios";

import { BaseResponse, SocialLoginResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import { ApiError } from "@/api/auth/resetPasswordApi";
import api from "@/api/axios";

const appleLoginApi = async (
    identityToken: string,
    fullName?: string,
): Promise<SocialLoginResponse> => {
    try {
        const response = await api.post<BaseResponse<SocialLoginResponse>>(
            API_ENDPOINTS.AUTH.SOCIAL_LOGIN_APPLE,
            { identityToken, fullName },
        );
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const code = error.response?.data?.status || "UNKNOWN";
            const message =
                error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
            throw new ApiError(code, message);
        }
        throw error;
    }
};

export default appleLoginApi;