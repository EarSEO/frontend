import { useCallback } from "react";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";

import { getSightDetail } from "@/api/sight/getSight";
import { useSightStore } from "@/store/useSightStore";

interface UseSightNavigationParams {
    mapRef: React.RefObject<MapRef | null>;
    location: {
        latitude: number;
        longitude: number;
    };
}

export const useSightNavigation = ({ mapRef, location }: UseSightNavigationParams) => {
    const navigateSightId = useSightStore((state) => state.navigateSightId);

    const navigateToSight = useCallback(async (sightId: string) => {
        try {
            useSightStore.getState().setDetailLoading(true);

            const detail = await getSightDetail({
                id: sightId,
                longitude: location.longitude,
                latitude: location.latitude,
            });

            const sight: SightInfo = {
                id: sightId,
                title: detail.title,
                longitude: detail.longitude,
                latitude: detail.latitude,
                geoHash: "",
            };

            // 지도 이동
            mapRef.current?.moveToLocation({
                latitude: detail.latitude,
                longitude: detail.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            useSightStore.getState().selectSight(sight);
            useSightStore.getState().setSightDetail(detail);
            useSightStore.getState().clearNavigateSightId();
        } catch (error) {
            console.error("관광지 조회 실패:", error);
            useSightStore.getState().clearNavigateSightId();
        } finally {
            useSightStore.getState().setDetailLoading(false);
        }
    }, [location.latitude, location.longitude, mapRef]);

    return {
        navigateSightId,
        navigateToSight,
    };
};