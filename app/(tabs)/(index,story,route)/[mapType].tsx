import React, { useEffect, useRef } from "react";

import { useSharedValue } from "react-native-reanimated";

import { BottomSheetMethods } from "@gorhom/bottom-sheet/src/types";
import { useGlobalSearchParams } from "expo-router";

import CurationBottomSheet from "@/components/bottomSheet/CurationBottomSheet";
import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import RouteBottomSheet from "@/components/bottomSheet/RouteBottomSheet";
import StoryBottomSheet from "@/components/bottomSheet/StoryBottomSheet";
import BaseMap from "@/components/map/BaseMap";
import MapHeader from "@/components/map/header/MapHeader";
import MapSearchBar from "@/components/map/header/MapSearchBar";

import { useBaseMap } from "@/hooks/map/useBaseMap";
import { useSightMap } from "@/hooks/sight/useSightMap";
import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";

import { useBottomSheetStore } from "@/store/common/useBottomSheetStore";
import { useBaseMapStore } from "@/store/map/useBaseMapStore";
import { useMapHeaderStore } from "@/store/map/useMapHeaderStore";
import { useRouteStore } from "@/store/route/useRouteStore";
import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

function MapTabScreen() {
  const { mapType } = useGlobalSearchParams();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const bottomSheetPosition = useSharedValue(0);
  const { setBottomSheetContent, setBottomSheetLayout, setIsBottomSheetDragg } =
    useBottomSheetStore();
  const { setMapHeaderContent } = useMapHeaderStore();
  const {
    setMapMovable,
    setEnableCluster,
    setCenterPinVisibility,
    setRegionChangeCompleteMethod,
  } = useBaseMapStore();
  const { onRegionChangeCompleteWithBoundingBox } = useBaseMap();
  //sight
  const { fetchSightInBoundingBox } = useSightMap();
  const { setSights } = useSightStore();
  //story
  const { fetchStorySpotInBoundingBox } = useStorySpotMap();
  const { selectedStorySpot, setSpotListInMap, setSearchedSpot } =
    useStoryStore();
  const { setNewSpotName, setStoryLocation } = useStoryAddStore();
  const storyAddStep = useStoryAddStore((state) => state.storyAddStep);
  //route
  const { setPathVisibility } = useRouteStore();

  useEffect(() => {
    /**TODO
     * 화면 별 요소 추가
     * - 초기 마커 컴포넌트
     * - regionChange 시 마커 로드 함수
     * - 검색바 컴포넌트
     * - 바텀시트 내부 컴포넌트
     * - 바텀시트 위치 조정
     *
     * TODO issue: param이 변경될때마다 세번씩 호출됨
     */
    if (!mapType) return;
    if (mapType === "route") {
      //TODO 경로 지도용 요소 추가
      setBottomSheetLayout({
        snapPoints: ["45%", "75%", "100%"],
        index: 0,
      });
      setIsBottomSheetDragg(true);
      setSights([]);
      setEnableCluster(false);
      setPathVisibility(true);
      setSpotListInMap([]);
      setBottomSheetContent(<RouteBottomSheet />);
    } else if (mapType === "sight") {
      //TODO 관광지 지도용 요소 추가
      setBottomSheetLayout({
        snapPoints: ["45%", "75%", "100%"],
        index: 0,
      });
      setIsBottomSheetDragg(true);
      setMapHeaderContent(
        <MapSearchBar
          placeHolder={"관광지 검색.."}
          onPressMapSearchBar={() => {
            //TODO 관광지 검색 모달
            console.log("sight map search bar pressed");
          }}
        />
      );
      setRegionChangeCompleteMethod(fetchSightInBoundingBox);
      //TODO 관광지 큐레이션 바텀시트 추가
      setBottomSheetContent(<CurationBottomSheet />);
    }

    if (mapType === "story") {
      setBottomSheetContent(<StoryBottomSheet />);
    }

    setTimeout(() => onRegionChangeCompleteWithBoundingBox(), 100);

    return () => {
      // store 기반 공유 컴포넌트 데이터 초기화
      setMapHeaderContent(undefined);
      setMapMovable(true);
      setEnableCluster(true);
      setRegionChangeCompleteMethod(undefined);
      setPathVisibility(false);
      setSights([]);
      setBottomSheetContent(undefined);
      selectedStorySpot([]);
      setSearchedSpot(undefined);
      setSpotListInMap([]);
      setCenterPinVisibility(false);
      setNewSpotName(undefined);
      setStoryLocation(undefined);
      setNewSpotName(undefined);
      setIsBottomSheetDragg(true);
    };
  }, [mapType]);

  useEffect(() => {
    if (mapType !== "story") return;
    switch (storyAddStep) {
      case "none":
        //TODO 이야기 지도용 요소 추가
        setBottomSheetLayout({
          snapPoints: ["45%", "75%", "100%"],
          index: 0,
        });
        setIsBottomSheetDragg(true);
        setMapHeaderContent(
          <MapSearchBar
            placeHolder={"이야기 검색.."}
            onPressMapSearchBar={() => {
              //TODO 스팟 검색 모달
              console.log("story map search bar pressed");
            }}
          />
        );
        setRegionChangeCompleteMethod(fetchStorySpotInBoundingBox);
        break;
      case "location":
        setCenterPinVisibility(true);
        setBottomSheetLayout({
          snapPoints: ["30%"],
          index: 0,
        });
        setIsBottomSheetDragg(false);
        setSpotListInMap([]);
        break;
      case "storyAdd":
        setBottomSheetLayout({
          snapPoints: ["100%"],
          index: 0,
        });
        setIsBottomSheetDragg(true);
        setSpotListInMap([]);
        break;
    }
  }, [mapType, storyAddStep]);

  return (
    <>
      <BaseMap bottomSheetPosition={bottomSheetPosition} />
      <MapHeader />
      <CustomBottomSheet
        bottomSheetRef={bottomSheetRef}
        animatedPosition={bottomSheetPosition}
      />
    </>
  );
}

export default React.memo(MapTabScreen);
