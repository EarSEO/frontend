import { create } from "zustand";

import { Point } from "@/types/geom";

import { useRouteCartStore } from "@/store/useRouteCartStore";
import { useRouteStore } from "@/store/useRouteStore";

interface UseMyRouteBottomSheetStore {
  isPreTour: boolean;
  isPreTourDelete: boolean;
  isOnTour: boolean;

  setPreTour: () => void;
  setPreTourDelete: () => void;
  setOnTour: (point: Point) => void;

  deleteList: string[];
  addDeleteList: (itemId: string) => void;
  removeDeleteList: (itemId: string) => void;
  applyDeleteList: () => void;
}

export const useMyRouteBottomSheetStore = create<UseMyRouteBottomSheetStore>(
  (set, get) => ({
    isPreTour: true,
    isPreTourDelete: false,
    isOnTour: false,

    setPreTour: (): void => {
      useRouteStore.getState().finishRoute();
      useRouteCartStore.getState().removeAllRouteCartItem();
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
    setOnTour: (point: Point): void => {
      set({
        isPreTour: false,
        isPreTourDelete: false,
        isOnTour: true,
      });
      useRouteStore.getState().setRoute({
        point: point,
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
  }),
);
