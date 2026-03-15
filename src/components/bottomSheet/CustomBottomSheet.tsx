import React from "react";

import {Text, View} from "react-native";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { BottomSheetProps } from "@/types/bottomSheet";

import { theme } from "@/styles/theme";

import {useBottomSheetStore} from "@/store/useBottomSheetStore";

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  children,
  animatedPosition,
  snapPoints,
  keyboardBehavior = "interactive",
  initialIndex,
}) => {
  const content = useBottomSheetStore(state => state.bottomSheetContent);
  const storeSnapPoints = useBottomSheetStore(state => state.snapPoints);
  const bottomSheetAbsoluteBottom = useBottomSheetStore(state => state.bottomSheetAbsoluteBottom);
  const onBottomSheetChange = useBottomSheetStore(state => state.onBottomSheetChange);
  const onBottomSheetAnimate = useBottomSheetStore(state => state.onBottomSheetAnimate);
  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints || storeSnapPoints || ["15%", "45%", "80%", "100%"]}
        index={initialIndex || 1}
        enablePanDownToClose={false}
        enableOverDrag={false}
        animatedPosition={animatedPosition}
        onChange={onBottomSheetChange}
        onAnimate={onBottomSheetAnimate}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior="restore"
        enableDynamicSizing={false}
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
          {children ?? content ?? <Text>컨텐츠가 없습니다</Text>}
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
