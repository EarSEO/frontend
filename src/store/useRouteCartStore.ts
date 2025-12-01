import { create } from "zustand";

import { Point } from "@/types/geom";

interface RouteCartStore {
  routeCartItems: RouteCartItem[];
  insertRouteCartItem: (routeCartItem: RouteCartItem) => void;
  removeRouteCartItem: (routeCartItemId: string) => void;
}

export interface RouteCartItem {
  sightId: string; // id
  theme: string; // 관광지 테마
  title: string; // 관광지명
  address: string; // 구/동 단위 주소
  point: Point; // 위경도
  imageUrl: string;
}

export const useRouteCartStore = create<RouteCartStore>((set, get) => ({
  routeCartItems: [],

  insertRouteCartItem: (routeCartItem: RouteCartItem): void => {
    set(({ routeCartItems }) => ({
      routeCartItems: [...routeCartItems, routeCartItem],
    }));
  },
  removeRouteCartItem: (routeCartItemId: string): void => {
    get().routeCartItems.filter((routeCartItem) => {
      return routeCartItem.sightId !== routeCartItemId;
    });
  },
}));
