import React, { useEffect } from "react";

import styled from "styled-components/native";

import Button from "@/components/common/Button";
import CurationDetail from "@/components/curation/CurationDetail";
import CurationList from "@/components/curation/CurationList";

import { useCurationDetail } from "@/hooks/sight/useCurationDetail";
import { useSightMap } from "@/hooks/sight/useSightMap";

import { theme } from "@/styles/theme";

import { useBottomSheetStore } from "@/store/common/useBottomSheetStore";
import { useNavigationBarStore } from "@/store/common/useNavigationBarStore";
import {
  RouteCartItem,
  useRouteCartStore,
} from "@/store/route/useRouteCartStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";

import SightDetailCard from "../sight/SightDetailCard";
import StoryBottomSheet from "./StoryBottomSheet";
import { useSightStore } from "@/store/sight/useSightStore";

const CurationBottomSheet = () => {
  const { fetchSightDetail } = useSightMap();
  const { setCurationSightList } = useSightStore();
  const { setBottomSheetAbsoluteBottom } = useBottomSheetStore();

  const {
    curations,
    isCurationLoading,
    fetchCurations,
    fetchCurationDetail,
    curationSightList,
    selectedCurationTitle,
    selectedCurationDescription,
    handleAddSightListToMy,
  } = useCurationDetail();

  const { deselectSight, selectedSight, sightDetail, isDetailLoading } =
    useSightMap();

  const { insertRouteCartItem, removeRouteCartItem, routeCartItems } =
    useRouteCartStore();
  const isInCart = routeCartItems.some(
    (item) => item.sightId === selectedSight?.id
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

  useEffect(() => {
    fetchCurations();
  }, []);

  useEffect(() => {
    const button =
      curationSightList !== undefined && selectedSight == null ? (
        <ButtonWrapper>
          <Button
            text="이 경로로 여행을 떠나보세요."
            fontSize={theme.typography.fontSize.sm}
            width="100%"
            onPress={handleAddSightListToMy}
          />
        </ButtonWrapper>
      ) : (
        <></>
      );

    setBottomSheetAbsoluteBottom(button);
    return () => {
      setBottomSheetAbsoluteBottom(undefined);
    };
  }, [curationSightList, selectedSight]);

  const { setNavigationBarHidden } = useNavigationBarStore();

  useEffect(() => {
    if (selectedSight && sightDetail) {
      setNavigationBarHidden(true);
    } else if (curationSightList !== undefined) {
      setNavigationBarHidden(true);
    } else {
      setNavigationBarHidden(false);
    }
  }, [setNavigationBarHidden, selectedSight, sightDetail, curationSightList]);

  const storyAddStep = useStoryAddStore((state) => state.storyAddStep);
  const { setStoryLocation } = useStoryAddStore();

  if (selectedSight && storyAddStep === "storyAdd") {
    return <StoryBottomSheet />;
  }

  if (selectedSight && sightDetail) {
    return (
      <SightDetailCard
        selectedSight={selectedSight}
        sightDetail={sightDetail}
        isDetailLoading={isDetailLoading}
        isInCart={isInCart}
        onToggleRoute={handleToggleRoute}
        handleHeaderClosePress={() => {
          deselectSight();
          setCurationSightList(undefined);
          setNavigationBarHidden(false);
        }}
        handleHeaderBackPress={() => {
          deselectSight();
          setStoryLocation(undefined);
        }}
      />
    );
  }

  if (curationSightList && curationSightList.length > 0) {
    return (
      <CurationDetail
        curationSightList={curationSightList}
        selectedCurationTitle={selectedCurationTitle}
        selectedCurationDescription={selectedCurationDescription}
        handleCardPress={fetchSightDetail}
        handleHeaderBackPress={() => {
          setCurationSightList(undefined);
          setNavigationBarHidden(false);
        }}
      />
    );
  }

  return (
    <CurationList
      curations={curations}
      isLoading={isCurationLoading}
      onCurationSelect={fetchCurationDetail}
    />
  );
};

export default CurationBottomSheet;

const ButtonWrapper = styled.View`
  margin-bottom: 50px;
`;
