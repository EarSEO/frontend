import React from "react";

import { Text, View } from "react-native";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { BottomSheetProps } from "@/types/bottomSheet";

import { theme } from "@/styles/theme";

import { useBottomSheetStore } from "@/store/common/useBottomSheetStore";

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  animatedPosition,
  keyboardBehavior = "interactive",
  initialIndex,
}) => {
  const content = useBottomSheetStore((state) => state.bottomSheetContent);
  const bottomSheetAbsoluteBottom = useBottomSheetStore(
    (state) => state.bottomSheetAbsoluteBottom
  );
  const onBottomSheetChange = useBottomSheetStore(
    (state) => state.onBottomSheetChange
  );
  const onBottomSheetAnimate = useBottomSheetStore(
    (state) => state.onBottomSheetAnimate
  );
  const isBottomSheetDragg = useBottomSheetStore(
    (state) => state.isBottomSheetDragg
  );
  const storeSnapPoints = useBottomSheetStore((state) => state.snapPoints);
  const index = useBottomSheetStore((state) => state.index);
  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={storeSnapPoints || ["45%"]}
        index={index ?? 0}
        enablePanDownToClose={false}
        enableOverDrag={false}
        animatedPosition={animatedPosition}
        onChange={onBottomSheetChange}
        onAnimate={onBottomSheetAnimate}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
        enableHandlePanningGesture={isBottomSheetDragg}
        enableContentPanningGesture={isBottomSheetDragg}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.grey.neutral300,
          height: 4,
          width: 40,
        }}
        handleStyle={{
          backgroundColor: theme.colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingVertical: 12,
        }}
        backgroundStyle={{
          backgroundColor: theme.colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {content ?? <Text>컨텐츠가 없습니다</Text>}
        </BottomSheetScrollView>
      </BottomSheet>
      <View
        style={{
          position: "absolute",
          bottom: theme.spacing.xs,
          left: theme.spacing.xs,
          right: theme.spacing.xs,
        }}
      >
        {bottomSheetAbsoluteBottom}
      </View>
    </>
  );
};

export default CustomBottomSheet;
