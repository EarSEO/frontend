import { RouteItemType } from "./route";

// 완료된 경로 요약 정보
export interface CompletedRouteSummary {
    routeId: number;
    name: string;
    completedAt: string; // yyyy.MM.dd 형식
}

// 완료된 경로 리스트 응답
export interface CompletedRouteListResponse {
    routes: CompletedRouteSummary[];
    hasNext: boolean;
}

// 완료된 경로 상세 아이템
export interface CompletedRouteItem {
    itemType: RouteItemType;
    itemId: string;
    itemName: string;
    itemImageUrl: string;
}

// 완료된 경로 상세 응답
export interface CompletedRouteDetailResponse {
    route: CompletedRouteSummary;
    items: CompletedRouteItem[];
}

// 경로 이름 수정 요청
export interface ModifyCompletedRouteRequest {
    name: string;
}

// 페이징 요청 파라미터
export interface CompletedRouteListRequest {
    page?: number;
    size?: number;
}