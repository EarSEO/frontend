import {LatLng} from "react-native-maps";

import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import {
  GetRouteRequest,
  GetRouteResponse,
  RouteItemType,
} from "@/types/route";

import endRouteApi from "@/api/route/endRouteApi";
import getRouteApi from "@/api/route/getRouteApi";
import {
  startGeofence,
  stopGeofence,
} from "@/services/geofence/geofenceService";
import { PROCEEDING_ROUTE_ID } from "@/store/secureStoreKey";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useRouteCartStore } from "@/store/useRouteCartStore";

interface RouteStore {
  path: LatLng[] | undefined;
  routeItems: RouteItem[] | undefined;

  setRoute: (body: GetRouteRequest) => Promise<GetRouteResponse | undefined>;
  finishRoute: (absoluteFinish?: boolean) => Promise<void>;
  getRouteTitle: () => string | undefined;
  getNumberOfQueuedDocent: () => number;
  getQueuedItems: () => RouteItem[];

  enQueueStorySpot: (itemId: number) => void;
  deQueueStorySpot: (itemId: number) => void;

  setVisited: (routeItem: RouteItem) => void;

  pathVisibility: boolean;
  setPathVisibility: (pathVisibility: boolean) => void;
}

export interface RouteItem {
  itemType: RouteItemType;
  itemId: number;
  itemName: string;
  itemDocentUrl: string;
  point: LatLng;
  itemTheme: string | undefined; // 관광지만
  itemImageUrl: string | undefined; // 관광지만
  summaryId: number | undefined; // 이야기 스팟만
  isQueued?: boolean; // 이야기 스팟만
  visited: boolean;
}

// 현재 진행중인 경로 관리 스토어
export const useRouteStore = create<RouteStore>((set, get) => ({
  path: undefined,
  routeItems: undefined,

  setRoute: async (
    body: GetRouteRequest,
  ): Promise<GetRouteResponse | undefined> => {
    try {
      const response: GetRouteResponse = await getRouteApi(body);
      SecureStore.setItem(PROCEEDING_ROUTE_ID, response.routeId.toString());
      set({
        path: response.path,
        routeItems: response.routeItems.map((routeItem) => ({
          ...routeItem,
          isQueued: routeItem.itemType === "SIGHT" ? undefined : false,
          visited: false,
        })),
      });
      startGeofence();
      return response;
    } catch (e) {
      set({ path: undefined, routeItems: undefined });
    }
  },
  finishRoute: async (absoluteFinish?: boolean) => {
    stopGeofence(); // 지오펜싱 종료
    useAudioPlayerStore.getState().removeItem(); // 오디오 끄기
    set({ path: undefined, routeItems: undefined }); // 진행중인 경로 제거
    const routeId = SecureStore.getItem(PROCEEDING_ROUTE_ID);
    await SecureStore.deleteItemAsync(PROCEEDING_ROUTE_ID); // 진행중인 경로 정보 제거
    if (!absoluteFinish) {
      // 종료 여부 판단
      const remains = get().routeItems?.filter(
        (routeItem) =>
          (routeItem.itemType === "SIGHT" && routeItem.visited === false) ||
          (routeItem.itemType === "STORY_SPOT" &&
            routeItem.visited === false &&
            routeItem.isQueued),
      ).length;
      absoluteFinish = remains === undefined || remains <= 1;
    }
    if (absoluteFinish) {
      // 관광지 경로 카드 비우기, 비정상 종료일경우 카트를 남겨둠
      useRouteCartStore.getState().removeAllRouteCartItem();
      if (routeId !== null) await endRouteApi(Number(routeId)); // 백엔드로 경로 종료 핑 (종료)
    }
  },
  getRouteTitle: (): string | undefined => {
    const { routeItems } = get();
    if (!routeItems) return undefined;
    const firstSightIdx = routeItems.findIndex(
      (routeItem) => routeItem.itemType === "SIGHT",
    );
    let lastSightIdx = -1;
    for (let i = routeItems.length - 1; i >= 0; i--) {
      if (routeItems[i].itemType === "SIGHT") {
        lastSightIdx = i;
        break;
      }
    }
    if (firstSightIdx < 0 || lastSightIdx < 0) return undefined;
    return (
      routeItems.at(firstSightIdx)?.itemName +
      "~" +
      routeItems.at(lastSightIdx)?.itemName
    );
  },
  getNumberOfQueuedDocent: (): number => {
    const { routeItems } = get();
    if (!routeItems) return 0;
    return routeItems.filter(
      (routeItem) =>
        routeItem.itemType === "SIGHT" ||
        (routeItem.itemType === "STORY_SPOT" && routeItem.isQueued),
    ).length;
  },
  getQueuedItems: (): RouteItem[] => {
    const { routeItems } = get();
    if (!routeItems) return [];
    return routeItems.filter(
      (routeItem) =>
        routeItem.itemType === "SIGHT" ||
        (routeItem.itemType === "STORY_SPOT" && routeItem.isQueued),
    );
  },
  enQueueStorySpot: (itemId: number): void => {
    const { routeItems } = get();
    if (!routeItems) return;

    const updatedRouteItems = routeItems.map((routeItem, idx) => {
      if (routeItem.itemType === "STORY_SPOT" && routeItem.itemId === itemId) {
        return {
          ...routeItem,
          isQueued: true,
        };
      }
      return routeItem;
    });

    set({ routeItems: updatedRouteItems });
    startGeofence();
  },

  deQueueStorySpot: (itemId: number): void => {
    const { routeItems } = get();
    if (!routeItems) return;

    const updatedRouteItems = routeItems.map((routeItem, idx) => {
      if (routeItem.itemType === "STORY_SPOT" && routeItem.itemId === itemId) {
        return {
          ...routeItem,
          isQueued: false,
        };
      }
      return routeItem;
    });

    set({ routeItems: updatedRouteItems });
    startGeofence();
  },

  setVisited: (routeItem: RouteItem): void => {
    set({
      routeItems: get().routeItems?.map((ri) => {
        if (
          ri.itemId === routeItem.itemId &&
          ri.itemType === routeItem.itemType
        ) {
          ri.visited = true;
        }
        return ri;
      }),
    });
  },

  pathVisibility: false,
  setPathVisibility: (pathVisibility: boolean): void => {
    set({pathVisibility});
  }
}));
