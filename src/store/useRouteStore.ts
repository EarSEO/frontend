import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { Point } from "@/types/geom";
import {
  GetRouteRequest,
  GetRouteResponse,
  RouteItemType,
} from "@/types/route";

import getRouteApi from "@/api/route/getRouteApi";
import { PROCEEDING_ROUTE_ID } from "@/store/secureStoreKey";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useRouteCartStore } from "@/store/useRouteCartStore";

interface RouteStore {
  path: Point[] | undefined;
  routeItems: RouteItem[] | undefined;

  setRoute: (body: GetRouteRequest) => Promise<GetRouteResponse | undefined>;
  finishRoute: () => Promise<void>;
  getRouteTitle: () => string | undefined;
  getNumberOfQueuedDocent: () => number;
  getQueuedItems: () => RouteItem[];

  enQueueStorySpot: (itemId: number) => void;
  deQueueStorySpot: (itemId: number) => void;
}

export interface RouteItem {
  itemType: RouteItemType;
  itemId: number;
  itemName: string;
  itemDocentUrl: string;
  point: Point;
  itemTheme: string | undefined; // 관광지만
  itemImageUrl: string | undefined; // 관광지만
  summaryId: number | undefined; // 이야기 스팟만
  isQueued?: boolean; // 이야기 스팟만
  visited: boolean;
}

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
      return response;
    } catch (e) {
      set({ path: undefined, routeItems: undefined });
    }
  },
  finishRoute: async (normalFinish?: boolean) => {
    const routeId = Number(SecureStore.getItem(PROCEEDING_ROUTE_ID));
    useAudioPlayerStore.getState().removeItem();
    if (normalFinish) useRouteCartStore.getState().removeAllRouteCartItem();
    set({ path: undefined, routeItems: undefined });
    await SecureStore.deleteItemAsync(PROCEEDING_ROUTE_ID);
  },
  getRouteTitle: (): string | undefined => {
    const { routeItems } = get();
    if (!routeItems) return undefined;
    const firstSightIdx = routeItems.findIndex(
      (routeItem) => routeItem.itemType === "SIGHT",
    );
    const lastSightIdx = routeItems.findLastIndex(
      (routeItem) => routeItem.itemType === "SIGHT",
    );
    if (!firstSightIdx || !lastSightIdx) return undefined;
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
  },
}));
