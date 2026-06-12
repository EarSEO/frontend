import React, { useEffect } from "react";

import { View } from "react-native";

import styled from "styled-components/native";

import EmptyTour from "@/components/docent/emptyTour/EmptyTour";
import DeleteTourItemButton from "@/components/myRoute/button/DeleteTourItemButton";
import OnTourButton from "@/components/myRoute/button/OnTourButton";
import PreTourButton from "@/components/myRoute/button/PreTourButton";
import MyRouteSightList from "@/components/myRoute/sight/MyRouteSightList";

import { theme } from "@/styles/theme";

import { useBottomSheetStore } from "@/store/common/useBottomSheetStore";
import { useMyRouteBottomSheetStore } from "@/store/route/useMyRouteBottomSheetStore";
import { useRouteCartStore } from "@/store/route/useRouteCartStore";

const RouteBottomSheet = () => {
  const routeCartItems = useRouteCartStore((state) => state.routeCartItems);
  const isOnTour = useMyRouteBottomSheetStore((state) => state.isOnTour);
  const isPreTour = useMyRouteBottomSheetStore((state) => state.isPreTour);
  const isPreTourDelete = useMyRouteBottomSheetStore(
    (state) => state.isPreTourDelete
  );
  const { setBottomSheetAbsoluteBottom } = useBottomSheetStore();

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

  useEffect(() => {
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

    setBottomSheetAbsoluteBottom(button);
    return () => {
      setBottomSheetAbsoluteBottom(undefined);
    };
  }, [isPreTour, isPreTourDelete, isOnTour, routeCartItems]);

  return (
    <View style={{ paddingBottom: 48 }}>
      <View style={{ alignSelf: "center" }}>{title}</View>
      {content}
    </View>
  );
};

export default RouteBottomSheet;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.bold};
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing.xl};
`;
