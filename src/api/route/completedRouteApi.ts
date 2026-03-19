import { BaseResponse } from "@/types/auth";
import {
    CompletedRouteDetailResponse,
    CompletedRouteListRequest,
    CompletedRouteListResponse,
    CompletedRouteSummary,
    ModifyCompletedRouteRequest,
} from "@/types/completedRoute";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

// 완료된 경로 리스트 조회
export const getCompletedRoutes = async (
    params?: CompletedRouteListRequest
): Promise<CompletedRouteListResponse> => {
    const response = await api.get<BaseResponse<CompletedRouteListResponse>>(
        API_ENDPOINTS.ROUTE.COMPLETED_LIST,
        {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
            },
        }
    );
    return response.data.data;
};

// 완료된 경로 상세 조회
export const getCompletedRouteDetail = async (
    routeId: number
): Promise<CompletedRouteDetailResponse> => {
    const response = await api.get<BaseResponse<CompletedRouteDetailResponse>>(
        API_ENDPOINTS.ROUTE.COMPLETED_DETAIL(routeId)
    );
    return response.data.data;
};

// 완료된 경로 이름 수정
export const modifyCompletedRouteName = async (
    routeId: number,
    data: ModifyCompletedRouteRequest
): Promise<CompletedRouteSummary> => {
    const response = await api.put<BaseResponse<CompletedRouteSummary>>(
        API_ENDPOINTS.ROUTE.COMPLETED_MODIFY(routeId),
        data
    );
    return response.data.data;
};

// 완료된 경로 삭제
export const deleteCompletedRoute = async (routeId: number): Promise<void> => {
    await api.delete(API_ENDPOINTS.ROUTE.COMPLETED_MODIFY(routeId));
};