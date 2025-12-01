import React, { useRef } from "react";

import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import EmptyTour from "@/components/docent/emptyTour/EmptyTour";
import Map from "@/components/map/Map";
import DeleteTourItemButton from "@/components/myRoute/button/DeleteTourItemButton";
import OnTourButton from "@/components/myRoute/button/OnTourButton";
import PreTourButton from "@/components/myRoute/button/PreTourButton";
import MyRouteSightList from "@/components/myRoute/sight/MyRouteSightList";

import { useLocation } from "@/hooks/useLocation";
import { useSightMap } from "@/hooks/useSightMap";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";

import { theme } from "@/styles/theme";

import { useMyRouteBottomSheetStore } from "@/store/useMyRouteBottomSheetStore";
import { useRouteCartStore } from "@/store/useRouteCartStore";
import { useRouteStore } from "@/store/useRouteStore";
import View = Animated.View;

export default function MyRoute() {
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);
  const { location } = useLocation();
  const { routeCartItems } = useRouteCartStore();
  const { routeItems } = useRouteStore();
  const isOnTour = useMyRouteBottomSheetStore((state) => state.isOnTour);
  const isPreTour = useMyRouteBottomSheetStore((state) => state.isPreTour);
  const isPreTourDelete = useMyRouteBottomSheetStore(
    (state) => state.isPreTourDelete,
  );

  const { sights, selectedSight, fetchSightsDebounced, fetchSightDetail } =
    useSightMap();

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

  const title = isPreTour ? (
    <Title>나의 경로</Title>
  ) : isPreTourDelete ? (
    <Title>나의 경로 삭제</Title>
  ) : isOnTour ? (
    <Title>여행중</Title>
  ) : (
    <></>
  );
  const content =
    routeCartItems.length === 0 ? <EmptyTour /> : <MyRouteSightList />;
  const button =
    routeCartItems.length === 0 ? (
      <></>
    ) : isPreTour ? (
      <PreTourButton />
    ) : isPreTourDelete ? (
      <DeleteTourItemButton />
    ) : isOnTour ? (
      <OnTourButton />
    ) : (
      <></>
    );

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
          <View style={{ paddingBottom: 48 }}>
            <View style={{ alignSelf: "center" }}>{title}</View>
            {content}
          </View>
        </CustomBottomSheet>
        <View
          style={{
            position: "absolute",
            bottom: theme.spacing.xs,
            left: theme.spacing.xs,
            right: theme.spacing.xs,
          }}
        >
          {button}
        </View>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.bold};
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing.xl};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
