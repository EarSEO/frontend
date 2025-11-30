import { SharedValue } from "react-native-reanimated";

import BottomSheet from "@gorhom/bottom-sheet";
export interface BottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  children: React.ReactNode;
  animatedPosition?: SharedValue<number>;
}
