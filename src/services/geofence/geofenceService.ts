import Constants from "expo-constants";
import * as Location from "expo-location";
import {
  LocationAccuracy,
  LocationGeofencingEventType,
  LocationRegion,
} from "expo-location";
import * as TaskManager from "expo-task-manager";
import { TaskManagerTaskBody } from "expo-task-manager";
import { getDistance } from "geolib";

import {
  routeItemToGeofenceData,
  routeItemToGeofenceId,
} from "@/types/geofence";

import { GEOFENCE_TASK } from "@/constants/taskManagerTaskKeys";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useRouteStore } from "@/store/useRouteStore";

const GEOFENCE_RADIUS =
  (Constants.expoConfig?.extra?.GEOFENCE_RADIUS as number) ?? 100;
const GEOFENCE_LIMIT = 20;

type GeofenceTaskData = {
  eventType: LocationGeofencingEventType;
  region: LocationRegion;
};

export const geofenceTask = async ({
  data,
  error,
}: TaskManagerTaskBody<GeofenceTaskData>) => {
  if (error) {
    console.error("Geofence Task error : ", error);
    return;
  }

  if (data) {
    const { eventType, region } = data;
    const geoPlay = useAudioPlayerStore.getState().geoPlay;
    const currentRouteItem = useRouteStore
      .getState()
      .routeItems?.filter(
        (routeItem) => region.identifier === routeItemToGeofenceId(routeItem),
      )
      .at(0);
    if (!currentRouteItem || currentRouteItem.visited) return;
    if (eventType === LocationGeofencingEventType.Enter) {
      if (geoPlay) {
        // 도슨트 재생
        useAudioPlayerStore.getState().setAudioMetadata(currentRouteItem);
      } else {
        // 푸시알림 발송
      }
      // 방문 처리
      useRouteStore.getState().setVisited(currentRouteItem);
      // 지오펜싱 최신화
      startGeofence();
    } else if (eventType === LocationGeofencingEventType.Exit) {
      const remains = useRouteStore
        .getState()
        .routeItems?.filter(
          (routeItem) =>
            (routeItem.itemType === "SIGHT" && routeItem.visited === false) ||
            (routeItem.itemType === "STORY_SPOT" &&
              routeItem.visited === false &&
              routeItem.isQueued),
        ).length;
      if (remains === undefined || remains <= 1) {
        // 모든 관광지, 방문 예정 스팟 방문 완료
        useRouteStore.getState().finishRoute(true);
      }
    }
  }
};

// 경로 생성, 도슨트 리스트 수정 시 호출
// export const startGeofence = async (geofences: GeofenceData[]) => {
export const startGeofence = async () => {
  const hasPermission = await checkPermission();
  if (!hasPermission) {
    throw new Error("위치권한이 필요합니다.");
  }
  const userLocation = await Location.getCurrentPositionAsync({
    accuracy: LocationAccuracy.High,
  });
  const geofences = useRouteStore
    .getState()
    .routeItems?.filter(
      (routeItem) =>
        (routeItem.itemType === "SIGHT" && routeItem.visited === false) ||
        (routeItem.itemType === "STORY_SPOT" &&
          routeItem.visited === false &&
          routeItem.isQueued),
    )
    .map((routeItem) => ({
      ...routeItem,
      distance: getDistance(userLocation.coords, routeItem.point),
    }))
    .sort((routeItem1, routeItem2) => routeItem1.distance - routeItem2.distance)
    .slice(0, GEOFENCE_LIMIT)
    .map((routeItem) => routeItemToGeofenceData(routeItem));
  if (!geofences) return;
  if (geofences.length === 0) {
    // 모든 관광지, 방문 예정 스팟 방문 완료
    return;
  }

  const regions: LocationRegion[] = geofences.map((spot) => ({
    identifier: spot.id,
    latitude: spot.point.latitude,
    longitude: spot.point.longitude,
    radius: GEOFENCE_RADIUS,
    notifyOnEnter: true,
    notifyOnExit: true,
  }));

  await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
};

// 경로 종료시 호출
export const stopGeofence = async () => {
  await Location.stopGeofencingAsync(GEOFENCE_TASK);
};

export const isGeofenceActive = async (): Promise<boolean> => {
  return await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK);
};

export const checkPermission = async (): Promise<boolean> => {
  const locationPermissionResponse =
    await Location.requestForegroundPermissionsAsync();
  if (locationPermissionResponse.status !== "granted") {
    return false;
  }

  const permissionResponse = await Location.requestBackgroundPermissionsAsync();
  if (permissionResponse.status !== "granted") {
    return false;
  }
  return true;
};
