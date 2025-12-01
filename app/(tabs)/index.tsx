import React, { useRef } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Map from "@/components/map/Map";
import SightDetailCard from "@/components/sight/SightDetailCard";

import { useLocation } from "@/hooks/useLocation";
import { useSightMap } from "@/hooks/useSightMap";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";

import { RouteCartItem, useRouteCartStore } from "@/store/useRouteCartStore";
// import { useRouteStore } from "@/store/useRouteStore";

export default function Index() {
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);
  // const { setRoute, finishRoute } = useRouteStore();
  const { location } = useLocation();
  const { insertRouteCartItem, removeRouteCartItem, routeCartItems } =
    useRouteCartStore();

  const {
    sights,
    selectedSight,
    sightDetail,
    isDetailLoading,
    fetchSightsDebounced,
    fetchSightDetail,
    deselectSight,
  } = useSightMap();

  const isInCart = routeCartItems.some(
    (item) => item.sightId === selectedSight?.id,
  );

  const handleToggleRoute = () => {
    if (!sightDetail || !selectedSight) return;

    if (isInCart) {
      removeRouteCartItem(selectedSight.id);
    } else {
      const cartItem: RouteCartItem = {
        sightId: selectedSight.id,
        theme: sightDetail.theme,
        title: sightDetail.title,
        address: sightDetail.address,
        point: {
          longitude: sightDetail.longitude,
          latitude: sightDetail.latitude,
        },
        imageUrl: sightDetail.imgUrl,
      };
      insertRouteCartItem(cartItem);
    }
  };

  // 지도 영역 변경 시 관광지 조회
  const handleRegionChangeComplete = (bounds: {
    minLongitude: number;
    minLatitude: number;
    maxLongitude: number;
    maxLatitude: number;
  }) => {
    fetchSightsDebounced(bounds);
  };

  // 마커 클릭 시
  const handleMarkerPress = (sight: SightInfo) => {
    fetchSightDetail(sight, {
      longitude: location.longitude,
      latitude: location.latitude,
    });
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map
          ref={mapRef}
          animatedPosition={animatedPosition}
          markers={sights}
          selectedMarkerId={selectedSight?.id}
          onMarkerPress={handleMarkerPress}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
        <CustomBottomSheet
          bottomSheetRef={bottomSheetRef}
          animatedPosition={animatedPosition}
        >
          <SightDetailCard
            selectedSight={selectedSight}
            sightDetail={sightDetail}
            isDetailLoading={isDetailLoading}
            isInCart={isInCart}
            onToggleRoute={handleToggleRoute}
            onClose={deselectSight}
          />
        </CustomBottomSheet>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
