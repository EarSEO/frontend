import { useCallback } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
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
      snapPoints={["10%", "45%", "95%"]}
      index={1}
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
      <BottomSheetScrollView
        style={{
          flex: 1,
        }}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
