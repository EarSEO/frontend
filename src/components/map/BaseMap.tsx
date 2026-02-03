import React, { useEffect, useRef } from "react";

import {Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import MapView, {PROVIDER_DEFAULT, Region} from "react-native-maps";
import type {PanDragEvent} from "react-native-maps/dist/src/MapView.types";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";

import {Locate, LocateFixed} from "lucide-react-native";

import ClusterMapView from "@/components/map/clustering/ClusteredMapView";

import {useBaseMap} from "@/hooks/useBaseMap";

import {theme} from "@/styles/theme";

import {useBaseMapStore} from "@/store/useBaseMapStore";
import {useBottomSheetStore} from "@/store/useBottomSheetStore";
import {useLocationStore} from "@/store/useLocationStore";

const LOCATION_BUTTON_SIZE = 48;
const LOCATION_BUTTON_MARGIN = 16;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AnimatedClusterMapView = React.memo(Animated.createAnimatedComponent(ClusterMapView));
const AnimatedTouchable = React.memo(Animated.createAnimatedComponent(TouchableOpacity));

interface BaseMapProps {
  initialRegion?: Region;
}

const BaseMap: React.FC<BaseMapProps> = ({initialRegion}) => {
  const mapRef = useRef<MapView>(null);
  const location = useLocationStore(state => state.location);
  const {setCameraFollow, onPressLocateButton, onRegionChange, onRegionChangeCompleteWithRegion, fitToPoints, initBaseMapBottomSheetCallbacks, onRegionChangeCompleteWithBoundingBox} = useBaseMap();
  const {setMapRef, setIsMapFollowingUser} = useBaseMapStore();
  const enableCluster = useBaseMapStore((state) => state.enableCluster);
  const isMapFollowingUser = useBaseMapStore((state) => state.isMapFollowingUser);
  const locationButtonVisible = useBaseMapStore((state) => state.locationButtonVisible);
  const mapComponent = useBaseMapStore((state) => state.mapComponent);
  const bottomSheetPosition = useBottomSheetStore((state) => state.bottomSheetPosition);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    if (!bottomSheetPosition) {
      return {bottom: LOCATION_BUTTON_MARGIN};
    }

    const translateY = bottomSheetPosition.value - (LOCATION_BUTTON_SIZE + LOCATION_BUTTON_MARGIN);
    return {top: 0, transform: [{translateY}]};
  });

  const animatedProps = useAnimatedProps(() => ({
    mapPadding: {
      // top: 50, // 검색바
      bottom: SCREEN_HEIGHT - ((bottomSheetPosition?.value ?? 0) + 70), // 바텀시트 + 네비게이션바
    }
  }));

  useEffect(() => {
    setMapRef(mapRef);
    // 화면 로드 후 사용자 위치로 이동
    setTimeout(() => {
      useBaseMapStore.getState().setIsMapFollowingUser(true);
      setCameraFollow(true);
      onRegionChangeCompleteWithBoundingBox();
    }, 500);
    // 바텀시트의 위치 상태에 따라 버튼 랜더링 및 마커 로드
    initBaseMapBottomSheetCallbacks();
  }, []);

  return (
    <>
      <AnimatedClusterMapView
        id={"baseMap"}
        clusteringEnabled={enableCluster}
        spiralEnabled={false}
        animatedProps={animatedProps}
        mapRef={mapRef}
        onMapReady={async () => {
          setMapRef(mapRef);
          useBaseMapStore.getState().mapRef = mapRef;
        }}
        style={[StyleSheet.absoluteFill]}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion || {...location, latitudeDelta: 0.01, longitudeDelta: 0.01}}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        pointsOfInterestFilter={['airport', 'publicTransport']} // POI 공항, 대중교통만 활성화
        scrollEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        clusterColor={theme.colors.main.primary}
        onRegionChangeStart={onRegionChange}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeCompleteWithRegion}
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
        followsUserLocation={isMapFollowingUser}
        spiderLineColor={"#00000000"}
        clusterFontFamily={theme.typography.fontFamily.bold}
      >
        {mapComponent}
      </AnimatedClusterMapView>
      <AnimatedTouchable
        style={[styles.locationButton, buttonAnimatedStyle, {display: locationButtonVisible ? 'flex' : 'none'}]}
        onPress={onPressLocateButton}
        activeOpacity={0.7}
      >
        {
          isMapFollowingUser ?
            <LocateFixed size={24} color={theme.colors.main.primary400}/>
            :
            <Locate size={24} color={theme.colors.grey.neutral600}/>
        }
      </AnimatedTouchable>
    </>
  )
}

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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 5,
  },
});

export default React.memo(BaseMap);
