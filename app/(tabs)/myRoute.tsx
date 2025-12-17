import React, { useEffect, useRef } from "react";

import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Polyline } from "react-native-maps";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import EmptyTour from "@/components/docent/emptyTour/EmptyTour";
import RouteMap, { RouteMapSightInfo } from "@/components/map/RouteMap";
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
  const routeCartItems = useRouteCartStore((state) => state.routeCartItems);
  const isOnTour = useMyRouteBottomSheetStore((state) => state.isOnTour);
  const isPreTour = useMyRouteBottomSheetStore((state) => state.isPreTour);
  const path = useRouteStore((state) => state.path);
  const routeItems = useRouteStore((state) => state.routeItems);
  const isPreTourDelete = useMyRouteBottomSheetStore(
    (state) => state.isPreTourDelete,
  );

  const { selectedSight, fetchSightsDebounced, fetchSightDetail } =
    useSightMap();

  const sightPoints =
    routeItems
      ?.filter((item) => item.itemType === "SIGHT")
      .map((item) => ({
        latitude: item.point.latitude,
        longitude: item.point.longitude,
      })) ?? [];

  useEffect(() => {
    if (!mapRef.current) return;

    const points =
      path && path.length > 0
        ? path.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))
        : sightPoints;

    if (!points || points.length === 0) return;

    setTimeout(() => {
      mapRef.current?.fitToPoints(points);
    }, 300);
  }, [path, sightPoints.length]);

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

  const routeSights: RouteMapSightInfo[] =
    routeItems === undefined
      ? []
      : routeItems
          ?.filter((routeItem) => routeItem.itemType === "SIGHT")
          .map((routeItem) => ({
            id: String(routeItem.itemId),
            title: routeItem.itemName,
            longitude: routeItem.point.longitude,
            latitude: routeItem.point.latitude,
          }));

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <RouteMap
          ref={mapRef}
          animatedPosition={animatedPosition}
          markers={routeSights}
        >
          {path && (
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
          )}
        </RouteMap>
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
