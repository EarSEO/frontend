import { Point } from "@/types/geom";

export type RouteItemType = "SIGHT" | "STORY_SPOT";

export interface GetRouteRequest {
  placeIds: string[];
}

export interface GetRouteResponse {
  routeId: number;
  path: Point[];
  routeItems: RouteItemResponse[];
}

export interface RouteItemResponse {
  itemType: RouteItemType;
  itemId: number;
  itemName: string;
  itemDocentUrl: string;
  point: Point;
  itemTheme: string | undefined; // 관광지만
  itemImageUrl: string | undefined; // 관광지만
  itemAddress: string | undefined; // 관광지만
  summaryId: number | undefined; // 이야기 스팟만
}
