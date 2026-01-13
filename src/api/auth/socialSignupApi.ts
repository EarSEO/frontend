import axios from "axios";

import { BaseResponse, LoginResponse, SocialSignUpRequest } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import { ApiError } from "@/api/auth/resetPasswordApi";
import api from "@/api/axios";

const socialSignupApi = async (
    userData: SocialSignUpRequest,
): Promise<LoginResponse> => {
    try {
        const response = await api.post<BaseResponse<LoginResponse>>(
            API_ENDPOINTS.AUTH.SOCIAL_SIGNUP,
            userData,
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

export default socialSignupApi;