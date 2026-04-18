import React, { useCallback, useEffect } from "react";

import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  MapPressEvent,
  Marker,
  MarkerPressEvent,
  Polyline,
  PROVIDER_DEFAULT,
  Region,
} from "react-native-maps";
import type { PanDragEvent } from "react-native-maps/dist/src/MapView.types";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Locate, LocateFixed } from "lucide-react-native";
import styled from "styled-components/native";

import ClusterMapView from "@/components/map/clustering/ClusteredMapView";

import { useSightMap } from "@/hooks/sight/useSightMap";
import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";
import { useBaseMap } from "@/hooks/useBaseMap";

import { theme } from "@/styles/theme";
import MapPin from "@/assets/icons/map/MapPin.svg";

import { useRouteStore } from "@/store/route/useRouteStore";
import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useBaseMapStore } from "@/store/useBaseMapStore";
import { useLocationStore } from "@/store/useLocationStore";

const LOCATION_BUTTON_SIZE = 48;
const LOCATION_BUTTON_MARGIN = 16;
const CENTER_PIN_HEIGHT = 45;
const CENTER_PIN_WIDTH = 45;
const CENTER_PIN_SHADOW_HEIGHT = 9;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const AnimatedClusterMapView = React.memo(
  Animated.createAnimatedComponent(ClusterMapView)
);
const AnimatedTouchable = React.memo(
  Animated.createAnimatedComponent(TouchableOpacity)
);

interface BaseMapProps {
  initialRegion?: Region;
  bottomSheetPosition: SharedValue<number>;
}

const BaseMap: React.FC<BaseMapProps> = ({
  initialRegion,
  bottomSheetPosition,
}) => {
  const location = useLocationStore((state) => state.location);
  const {
    setCameraFollow,
    onPressLocateButton,
    onRegionChange,
    onRegionChangeCompleteWithRegion,
    fitToPoints,
    initBaseMapBottomSheetCallbacks,
    onRegionChangeCompleteWithBoundingBox,
  } = useBaseMap();
  const { setIsMapFollowingUser, setCenterPinPoint } = useBaseMapStore();
  const mapRef = useBaseMapStore((state) => state.mapRef);
  const enableCluster = useBaseMapStore((state) => state.enableCluster);
  const mapMovable = useBaseMapStore((state) => state.mapMovable);
  const isMapFollowingUser = useBaseMapStore(
    (state) => state.isMapFollowingUser
  );
  const locationButtonVisible = useBaseMapStore(
    (state) => state.locationButtonVisible
  );
  const mapComponent = useBaseMapStore((state) => state.mapComponent);
  const centerPinVisibility = useBaseMapStore(
    (state) => state.centerPinVisibility
  );

  const { fetchSightDetail } = useSightMap();
  const { selectSight } = useSightStore();
  const selectedSight = useSightStore((state) => state.selectedSight);
  const sights = useSightStore((state) => state.sights);

  const briefSpotInfo = useStoryStore((state) => state.briefSpotInfo);
  const spotLists = useStoryStore((state) => state.spotLists);
  const { selectedStorySpot } = useStoryStore();
  const { fetchSpotDetail } = useStorySpotMap();
  const { setStoryLocation } = useStoryAddStore();
  const storyAddStep = useStoryAddStore((state) => state.storyAddStep);
  const setSpotListInMap = useStoryStore((state) => state.setSpotListInMap);

  const routeItems = useRouteStore((state) => state.routeItems);
  const path = useRouteStore((state) => state.path);
  const pathVisibility = useRouteStore((state) => state.pathVisibility);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    if (!bottomSheetPosition) {
      return { bottom: LOCATION_BUTTON_MARGIN };
    }

    const translateY =
      bottomSheetPosition.value -
      (LOCATION_BUTTON_SIZE + LOCATION_BUTTON_MARGIN);
    return { top: 0, transform: [{ translateY }] };
  });

  const animatedProps = useAnimatedProps(() => ({
    mapPadding: {
      // top: 50, // 검색바
      bottom: SCREEN_HEIGHT - ((bottomSheetPosition?.value ?? 0) + 70), // 바텀시트 + 네비게이션바
    },
  }));

  const pinAnimatedStyle = useAnimatedStyle(() => {
    const visibleMapHeight = bottomSheetPosition.value;
    const centerY = visibleMapHeight / 2;
    return {
      top: centerY - CENTER_PIN_HEIGHT / 2 + CENTER_PIN_SHADOW_HEIGHT,
    };
  });

  //MapPin store에 저장
  const handleCenterPinRegion = useCallback(
    (region: Region) => {
      setStoryLocation({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    },
    [setStoryLocation]
  );

  const handleRegionChangeComplete = useCallback(
    (region: Region, details: any) => {
      onRegionChangeCompleteWithRegion(region, details, undefined);
      handleCenterPinRegion(region);
    },
    [onRegionChangeCompleteWithRegion, handleCenterPinRegion]
  );

  useEffect(() => {
    // 화면 로드 후 사용자 위치로 이동
    setTimeout(() => {
      useBaseMapStore.getState().setIsMapFollowingUser(true);
      setCameraFollow(true);
      onRegionChangeCompleteWithBoundingBox();
    }, 500);
    // 바텀시트의 위치 상태에 따라 버튼 랜더링 및 마커 로드
    initBaseMapBottomSheetCallbacks();
  }, []);

  useEffect(() => {
    if (storyAddStep !== "none") {
      setSpotListInMap([]);
    }
  }, [storyAddStep, setSpotListInMap]);

  return (
    <>
      <AnimatedClusterMapView
        id={"baseMap"}
        clusteringEnabled={enableCluster}
        spiralEnabled={false}
        animatedProps={animatedProps}
        mapRef={mapRef}
        style={[StyleSheet.absoluteFill]}
        provider={PROVIDER_DEFAULT}
        initialRegion={
          initialRegion || {
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        pointsOfInterestFilter={["airport", "publicTransport"]} // POI 공항, 대중교통만 활성화
        scrollEnabled={mapMovable}
        zoomEnabled={mapMovable}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        clusterColor={theme.colors.main.primary}
        onRegionChangeStart={onRegionChange}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
        userLocationUpdateInterval={1000}
        userLocationFastestInterval={1000}
        extent={1000} // 화면을 몇개의 타일로 나눌지
        radius={100} // 몇개의 타일로 클러스터를 형성할지
        minPoints={2} // 클러스터 형성 최소 개수
        // @ts-ignore
        onClusterPress={(cluster: Marker, markers: Marker[] | undefined) => {
          if (markers)
            fitToPoints(markers?.map((marker) => marker.properties.coordinate));
        }}
        onPanDrag={(event: PanDragEvent) => {
          if (isMapFollowingUser) {
            setIsMapFollowingUser(false);
          }
        }}
        onPress={(e: MapPressEvent) => {
          e.stopPropagation();
          selectSight(undefined);
          selectedStorySpot([]);
        }}
        followsUserLocation={isMapFollowingUser}
        spiderLineColor={"#00000000"}
        clusterFontFamily={theme.typography.fontFamily.bold}
      >
        {mapComponent}
        {pathVisibility && path && (
          <>
            <Polyline
              coordinates={path?.map((point) => ({
                latitude: point.latitude,
                longitude: point.longitude,
              }))}
              strokeColor={theme.colors.main.primary400}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              geodesic={true}
            />
            {routeItems?.map((sight) => (
              <Marker
                key={sight.itemId}
                coordinate={{
                  latitude: sight.point.latitude,
                  longitude: sight.point.longitude,
                }}
                title={sight.itemName}
                pinColor={theme.colors.main.primary}
              />
            ))}
          </>
        )}
        {sights.map((sight) => (
          <Marker
            key={sight.id}
            coordinate={{
              latitude: sight.latitude,
              longitude: sight.longitude,
            }}
            pinColor={
              selectedSight?.id === sight.id
                ? "#FF6B6B"
                : theme.colors.main.primary
            }
            onPress={(e: MarkerPressEvent) => {
              e.stopPropagation();
              fetchSightDetail(sight, {
                longitude: sight.longitude,
                latitude: sight.latitude,
              });
              selectSight(sight);
            }}
            onDeselect={() => selectSight(undefined)}
          />
        ))}
        {spotLists.map((spots) => (
          <Marker
            key={spots.storySpotId}
            coordinate={{
              latitude: spots.latitude,
              longitude: spots.longitude,
            }}
            pinColor={
              briefSpotInfo?.storySpotId === spots.storySpotId
                ? "#FF6B6B"
                : theme.colors.main.primary
            }
            onPress={(e) => {
              e.stopPropagation();
              fetchSpotDetail(spots);
            }}
          />
        ))}
      </AnimatedClusterMapView>

      {centerPinVisibility && (
        <AnimatedCenterPin style={pinAnimatedStyle}>
          <MapPin width={CENTER_PIN_WIDTH} height={CENTER_PIN_HEIGHT} />
        </AnimatedCenterPin>
      )}
      <AnimatedTouchable
        style={[
          styles.locationButton,
          buttonAnimatedStyle,
          { display: locationButtonVisible ? "flex" : "none" },
        ]}
        onPress={onPressLocateButton}
        activeOpacity={0.7}
      >
        {isMapFollowingUser ? (
          <LocateFixed size={24} color={theme.colors.main.primary400} />
        ) : (
          <Locate size={24} color={theme.colors.grey.neutral600} />
        )}
      </AnimatedTouchable>
    </>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: "absolute",
    right: 16,
    width: LOCATION_BUTTON_SIZE,
    height: LOCATION_BUTTON_SIZE,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 5,
  },
});

const CenterPin = styled.View`
  position: absolute;
  left: 50%;
  top: 40%;
  margin-left: -22.5px;
  margin-top: 12px;
  pointer-events: none;
`;

const AnimatedCenterPin = Animated.createAnimatedComponent(CenterPin);

export default React.memo(BaseMap);
