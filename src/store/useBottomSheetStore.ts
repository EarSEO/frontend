import {SharedValue} from "react-native-reanimated";

import {SNAP_POINT_TYPE} from "@gorhom/bottom-sheet";
import {create} from "zustand";

interface BottomSheetStore {
  bottomSheetPosition: SharedValue<number> | undefined;
  setBottomSheetPosition: (bottomSheetPosition: SharedValue<number>) => void;

  onBottomSheetChange: ((index: number, position: number, type: SNAP_POINT_TYPE) => void) | undefined;
  setOnBottomSheetChange: (onBottomSheetChange: (index: number, position: number, type: SNAP_POINT_TYPE) => void) => void;

  onBottomSheetAnimate: ((fromIndex: number, toIndex: number) => void) | undefined;
  setOnBottomSheetAnimate: (onBottomSheetAnimate: (fromIndex: number, toIndex: number) => void) => void;

  snapPoints: string[] | undefined;
  setSnapPoints: (snapPoints?: string[]) => void;
}

export const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  bottomSheetPosition: undefined,
  setBottomSheetPosition: (bottomSheetPosition: SharedValue<number>) => {
    set({bottomSheetPosition});
  },

  onBottomSheetChange: undefined,
  setOnBottomSheetChange: (onBottomSheetChange) => {
    set({onBottomSheetChange});
  },

  onBottomSheetAnimate: undefined,
  setOnBottomSheetAnimate: (onBottomSheetAnimate) => {
    set({onBottomSheetAnimate});
  },

  snapPoints: undefined,
  setSnapPoints: (snapPoints?: string[]) => {
    set({snapPoints: snapPoints});
  },
}))
