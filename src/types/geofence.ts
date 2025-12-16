import { Point } from "@/types/geom";

import { RouteItem } from "@/store/useRouteStore";

export type GeofenceType = "RouteItem";

export interface GeofenceData {
  id: string;
  geofenceType: GeofenceType;
  point: Point;
}

export const routeItemToGeofenceData = (routeItem: RouteItem): GeofenceData => {
  return {
    id: routeItemToGeofenceId(routeItem),
    geofenceType: "RouteItem",
    point: routeItem.point,
  } as GeofenceData;
};

export const routeItemToGeofenceId = (routeItem: RouteItem): string => {
  if (routeItem.itemType === "SIGHT") {
    return routeItem.itemType + "_" + String(routeItem.itemId);
  } else if (routeItem.itemType === "STORY_SPOT") {
    return routeItem.itemType + "_" + String(routeItem.summaryId);
  }
  return "null";
};
