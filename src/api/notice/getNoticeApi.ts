import { BaseResponse } from "@/types/auth";
import { NoticeDetail, NoticePageResponse } from "@/types/notice";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "../axios";

export const getNoticeList = async (
    page: number = 0,
    size: number = 10
): Promise<NoticePageResponse> => {
    try {
        const response = await api.get<BaseResponse<NoticePageResponse>>(
            API_ENDPOINTS.NOTICE.LIST,
            { params: { page, size, sort: "id,desc" } }
        );
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getNoticeDetail = async (
    noticeId: number
): Promise<NoticeDetail> => {
    try {
        const response = await api.get<BaseResponse<NoticeDetail>>(
            API_ENDPOINTS.NOTICE.DETAIL(noticeId)
        );
        return response.data.data;
    } catch (error) {
        throw error;
    }
};