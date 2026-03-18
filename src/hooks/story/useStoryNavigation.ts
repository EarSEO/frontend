import { useCallback } from "react";

import { MapRef } from "@/types/map";

import { useStoryStore } from "@/store/story/useStoryStore";

interface UseStoryNavigationParams {
    mapRef: React.RefObject<MapRef | null>;
    location: {
        latitude: number;
        longitude: number;
    };
    setSelectedMarker: (id: number | undefined) => void;
}

export const useStoryNavigation = ({ mapRef, location, setSelectedMarker }: UseStoryNavigationParams) => {
    const navigateStorySpotId = useStoryStore((state) => state.navigateStorySpotId);
    const { setStoryInfo, setStorySpotBriefInfo } = useStoryStore();

    const navigateToStorySpot = useCallback(async (storySpotId: number) => {
        try {
            const storyRequest = {
                storySpotId,
                query: {
                    query: {
                        longitude: location.longitude,
                        latitude: location.latitude,
                        locale: "KO" as const,
                        page: 0,
                        size: 1000,
                        sort: "createdAt,desc" as const,
                    },
                },
            };

            // 스토어 업데이트 (바텀시트 데이터)
            const response = await setStoryInfo(storyRequest);

            const briefSpotInfo = response?.briefSpotInfo;

            if (briefSpotInfo?.latitude && briefSpotInfo?.longitude) {
                // 스토어 업데이트
                setStorySpotBriefInfo({
                    latitude: briefSpotInfo.latitude,
                    longitude: briefSpotInfo.longitude,
                });

                // 지도 이동
                mapRef.current?.moveToLocation({
                    latitude: briefSpotInfo.latitude,
                    longitude: briefSpotInfo.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                // 바텀시트 전환
                setSelectedMarker(storySpotId);
            }

            useStoryStore.getState().clearNavigateStorySpotId();
        } catch (error) {
            console.error("이야기 스팟 조회 실패:", error);
            useStoryStore.getState().clearNavigateStorySpotId();
        }
    }, [location.latitude, location.longitude, mapRef, setSelectedMarker, setStoryInfo, setStorySpotBriefInfo]);

    return {
        navigateStorySpotId,
        navigateToStorySpot,
    };
};