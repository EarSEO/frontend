import { create } from "zustand";

import {
    CompletedRouteItem,
    CompletedRouteSummary,
} from "@/types/completedRoute";

import {
    deleteCompletedRoute,
    getCompletedRouteDetail,
    getCompletedRoutes,
    modifyCompletedRouteName,
} from "@/api/route/completedRouteApi";

type CompletedRouteState = {
    routes: CompletedRouteSummary[];
    hasNext: boolean;
    currentPage: number;
    isLoading: boolean;

    selectedRoute: CompletedRouteSummary | null;
    selectedRouteItems: CompletedRouteItem[];
    isDetailLoading: boolean;

    fetchRoutes: (isRefresh?: boolean) => Promise<void>;
    fetchRouteDetail: (routeId: number) => Promise<void>;
    modifyRouteName: (routeId: number, name: string) => Promise<void>;
    deleteRoute: (routeId: number) => Promise<void>;
    clearDetail: () => void;
};

export const useCompletedRoute = create<CompletedRouteState>((set, get) => ({
    routes: [],
    hasNext: false,
    currentPage: 0,
    isLoading: false,

    selectedRoute: null,
    selectedRouteItems: [],
    isDetailLoading: false,

    fetchRoutes: async (isRefresh = false) => {
        const { isLoading, currentPage, hasNext } = get();

        if (isLoading) return;
        if (!isRefresh && !hasNext && currentPage > 0) return;

        set({ isLoading: true });

        try {
            const page = isRefresh ? 0 : currentPage;
            const response = await getCompletedRoutes({ page, size: 10 });

            set((state) => ({
                routes: isRefresh
                    ? response.routes
                    : [...state.routes, ...response.routes],
                hasNext: response.hasNext,
                currentPage: page + 1,
            }));
        } catch (error) {
            console.error("완료된 경로 조회 실패:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchRouteDetail: async (routeId: number) => {
        set({ isDetailLoading: true });

        try {
            const response = await getCompletedRouteDetail(routeId);

            set({
                selectedRoute: response.route,
                selectedRouteItems: response.items,
            });
        } catch (error) {
            console.error("경로 상세 조회 실패:", error);
        } finally {
            set({ isDetailLoading: false });
        }
    },

    modifyRouteName: async (routeId: number, name: string) => {
        try {
            const updated = await modifyCompletedRouteName(routeId, { name });

            set((state) => ({
                routes: state.routes.map((route) =>
                    route.routeId === routeId ? { ...route, name: updated.name } : route
                ),
                selectedRoute: state.selectedRoute?.routeId === routeId
                    ? { ...state.selectedRoute, name: updated.name }
                    : state.selectedRoute,
            }));
        } catch (error) {
            console.error("경로 이름 수정 실패:", error);
            throw error;
        }
    },

    deleteRoute: async (routeId: number) => {
        try {
            await deleteCompletedRoute(routeId);

            set((state) => ({
                routes: state.routes.filter((route) => route.routeId !== routeId),
            }));
        } catch (error) {
            console.error("경로 삭제 실패:", error);
            throw error;
        }
    },

    clearDetail: () => {
        set({
            selectedRoute: null,
            selectedRouteItems: [],
        });
    },
}));