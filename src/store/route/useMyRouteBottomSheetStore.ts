import { LatLng } from "react-native-maps";

import * as Location from "expo-location";
import { create } from "zustand";

import { useRouteCartStore } from "@/store/route/useRouteCartStore";
import { useRouteStore } from "@/store/route/useRouteStore";

interface MyRouteBottomSheetStore {
  isPreTour: boolean;
  isPreTourDelete: boolean;
  isOnTour: boolean;

  setPreTour: (isFinish?: boolean) => void;
  setPreTourDelete: () => void;
  setOnTour: () => void;

  deleteList: string[];
  addDeleteList: (itemId: string) => void;
  removeDeleteList: (itemId: string) => void;
  applyDeleteList: () => void;
}

// 경로 탭 바텀시트 정보 관리 스토어
export const useMyRouteBottomSheetStore = create<MyRouteBottomSheetStore>(
  (set, get) => ({
    isPreTour: true,
    isPreTourDelete: false,
    isOnTour: false,

    setPreTour: (isFinish?: boolean): void => {
      if (isFinish) useRouteStore.getState().finishRoute();
      set({
        isPreTour: true,
        isPreTourDelete: false,
        isOnTour: false,
      });
    },
    setPreTourDelete: (): void => {
      set({
        isPreTour: false,
        isPreTourDelete: true,
        isOnTour: false,
      });
    },
    setOnTour: async (): Promise<void> => {
      const currentPosition = await Location.getCurrentPositionAsync();
      set({
        isPreTour: false,
        isPreTourDelete: false,
        isOnTour: true,
      });
      useRouteStore.getState().setRoute({
        point: {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        } as LatLng,
        placeIds: useRouteCartStore
          .getState()
          .routeCartItems.map((routCartItem) => routCartItem.sightId),
      });
    },
    deleteList: [],
    addDeleteList: (itemId: string): void => {
      set({
        deleteList: [...get().deleteList, itemId],
      });
    },
    removeDeleteList: (itemId: string): void => {
      set({
        deleteList: get().deleteList.filter((listItemId) => {
          return itemId !== listItemId;
        }),
      });
    },
    applyDeleteList: (): void => {
      get().deleteList.forEach((itemId) => {
        useRouteCartStore.getState().removeRouteCartItem(itemId);
      });
      set({
        deleteList: [],
      });
    },
  })
);
