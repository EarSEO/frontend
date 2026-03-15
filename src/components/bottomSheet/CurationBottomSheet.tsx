import React, {useEffect} from "react";

import Button from "@/components/common/Button";
import CurationDetail from "@/components/curation/CurationDetail";
import CurationList from "@/components/curation/CurationList";

import {useCurationDetail} from "@/hooks/sight/useCurationDetail";
import {useSightMap} from "@/hooks/useSightMap";

import {theme} from "@/styles/theme";

import {useBottomSheetStore} from "@/store/useBottomSheetStore";

const CurationBottomSheet = () => {
  const {fetchSightDetail} = useSightMap();
  const {setBottomSheetAbsoluteBottom} = useBottomSheetStore();

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

  useEffect(() => {
    fetchCurations();
  }, []);

  useEffect(() => {
    const button =
      curationSightList !== undefined ? (
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
    }
  }, [curationSightList]);

  return (
    <>
      {curationSightList !== undefined ? (
        <>
          <CurationDetail
            curationSightList={curationSightList}
            selectedCurationTitle={selectedCurationTitle}
            selectedCurationDescription={selectedCurationDescription}
            handleCardPress={fetchSightDetail}
            handleHeaderBackPress={() => setCurationSightList(undefined)}
          />
        </>
      ) : (
        <CurationList
          curations={curations}
          isLoading={isCurationLoading}
          onCurationSelect={fetchCurationDetail}
        />
      )}
    </>
  );
};

export default CurationBottomSheet;
