import React, { useEffect } from "react";

import Button from "@/components/common/Button";
import CurationDetail from "@/components/curation/CurationDetail";
import CurationList from "@/components/curation/CurationList";

import { useCurationDetail } from "@/hooks/sight/useCurationDetail";
import { useSightMap } from "@/hooks/sight/useSightMap";

import { theme } from "@/styles/theme";

import {
  RouteCartItem,
  useRouteCartStore,
} from "@/store/route/useRouteCartStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useBottomSheetStore } from "@/store/useBottomSheetStore";

import SightDetailCard from "../sight/SightDetailCard";
import StoryBottomSheet from "./StoryBottomSheet";

const CurationBottomSheet = () => {
  const { fetchSightDetail } = useSightMap();
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
    setCurationSightList,
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
        <Button
          text="이 경로로 여행을 떠나보세요."
          fontSize={theme.typography.fontSize.sm}
          width="100%"
          onPress={handleAddSightListToMy}
        />
      ) : (
        <></>
      );

    setBottomSheetAbsoluteBottom(button);
    return () => {
      setBottomSheetAbsoluteBottom(undefined);
    };
  }, [curationSightList, selectedSight]);

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
          setCurationSightList(undefined);
          deselectSight();
        }}
        handleHeaderBackPress={() => {
          deselectSight();
          setStoryLocation(undefined);
        }}
      />
    );
  }

  if (curationSightList !== undefined) {
    return (
      <CurationDetail
        curationSightList={curationSightList}
        selectedCurationTitle={selectedCurationTitle}
        selectedCurationDescription={selectedCurationDescription}
        handleCardPress={fetchSightDetail}
        handleHeaderBackPress={() => setCurationSightList(undefined)}
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
