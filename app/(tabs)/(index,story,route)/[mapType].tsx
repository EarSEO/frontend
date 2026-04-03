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

import { useSightMap } from "@/hooks/sight/useSightMap";
import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";
import { useBaseMap } from "@/hooks/useBaseMap";

import { useRouteStore } from "@/store/route/useRouteStore";
import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useBaseMapStore } from "@/store/useBaseMapStore";
import { useBottomSheetStore } from "@/store/useBottomSheetStore";
import { useMapHeaderStore } from "@/store/useMapHeaderStore";

function MapTabScreen() {
  const { mapType } = useGlobalSearchParams();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const bottomSheetPosition = useSharedValue(0);
  const { setSnapPoints, setBottomSheetContent } = useBottomSheetStore();
  const { setMapHeaderContent } = useMapHeaderStore();
  const { setMapMovable, setEnableCluster, setRegionChangeCompleteMethod } =
    useBaseMapStore();
  const { onRegionChangeCompleteWithBoundingBox } = useBaseMap();
  const { fetchSightInBoundingBox } = useSightMap();
  const { fetchStorySpotInBoundingBox } = useStorySpotMap();
  const { selectedStorySpot, setSpotListInMap } = useStoryStore();
  const { setSights } = useSightStore();
  const { setPathVisibility } = useRouteStore();
  const { onStoryAdd } = useStoryAddStore();
  const storyLocation = useStoryAddStore((state) => state.storyLocation);

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
    if (onStoryAdd) {
    } else if (mapType === "route") {
      //TODO 경로 지도용 요소 추가
      setSnapPoints(["45%", "75%"]);
      setTimeout(() => bottomSheetRef.current?.snapToIndex(0), 200);
      setSights([]);
      setEnableCluster(false);
      setPathVisibility(true);
      setSpotListInMap([]);
      setBottomSheetContent(<RouteBottomSheet />);
    } else if (mapType === "sight") {
      //TODO 관광지 지도용 요소 추가
      setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 200);
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
    } else if (mapType === "story") {
      //TODO 이야기 지도용 요소 추가
      setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 200);
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
      //TODO 이야기 바텀시트 추가
      setBottomSheetContent(<StoryBottomSheet />);
    }
    setTimeout(() => onRegionChangeCompleteWithBoundingBox(), 100);

    return () => {
      // store 기반 공유 컴포넌트 데이터 초기화
      bottomSheetRef.current?.snapToPosition("10%");
      setSnapPoints(undefined);
      setMapHeaderContent(undefined);
      setMapMovable(true);
      setEnableCluster(true);
      setRegionChangeCompleteMethod(undefined);
      setPathVisibility(false);
      setSights([]);
      setBottomSheetContent(undefined);
      selectedStorySpot([]);
    };
  }, [mapType, onStoryAdd]);

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
