import {LatLng} from "react-native-maps";

export type RouteItemType = "SIGHT" | "STORY_SPOT";

export interface GetRouteRequest {
  point: LatLng;
  placeIds: string[];
}

export interface GetRouteResponse {
  routeId: number;
  path: LatLng[];
  routeItems: RouteItemResponse[];
}

export interface RouteItemResponse {
  itemType: RouteItemType;
  itemId: number;
  itemName: string;
  itemDocentUrl: string;
  point: LatLng;
  itemTheme: string | undefined; // 관광지만
  itemImageUrl: string | undefined; // 관광지만
  itemAddress: string | undefined; // 관광지만
  summaryId: number | undefined; // 이야기 스팟만
}
