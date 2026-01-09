import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { BottomSheetProps } from "@/types/bottomSheet";

import { theme } from "@/styles/theme";

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  children,
  animatedPosition,
  snapPoints,
  keyboardBehavior = "interactive",
  initialIndex,
}) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints || ["15%", "45%", "100%"]}
      index={initialIndex || 1}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animatedPosition={animatedPosition}
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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
