import { useCallback } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { BottomSheetProps } from "@/types/bottomSheet";

import { theme } from "@/styles/theme";

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
  bottomSheetRef,
  children,
  animatedPosition,
}) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["45%", "95%"]}
      index={0}
      enablePanDownToClose={false}
      enableOverDrag={false}
      animatedPosition={animatedPosition}
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
      <BottomSheetView
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.md,
        }}
      >
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
