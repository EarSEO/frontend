import React from "react";

import { devtools } from "@csark0812/zustand-expo-devtools";
import { SNAP_POINT_TYPE } from "@gorhom/bottom-sheet";
import { create } from "zustand";

interface BottomSheetStore {
  onBottomSheetChange:
    | ((index: number, position: number, type: SNAP_POINT_TYPE) => void)
    | undefined;
  setOnBottomSheetChange: (
    onBottomSheetChange: (
      index: number,
      position: number,
      type: SNAP_POINT_TYPE
    ) => void
  ) => void;

  onBottomSheetAnimate:
    | ((fromIndex: number, toIndex: number) => void)
    | undefined;
  setOnBottomSheetAnimate: (
    onBottomSheetAnimate: (fromIndex: number, toIndex: number) => void
  ) => void;

  snapPoints: (string | number)[];
  setSnapPoints: (snapPoints?: (string | number)[]) => void;

  bottomSheetContent: React.ReactNode;
  setBottomSheetContent: (content: React.ReactNode) => void;

  bottomSheetAbsoluteBottom: React.ReactNode;
  setBottomSheetAbsoluteBottom: (
    bottomSheetAbsoluteBottom: React.ReactNode
  ) => void;
}

export const useBottomSheetStore = create<BottomSheetStore>()(
  devtools(
    (set, get) => ({
      onBottomSheetChange: undefined,
      setOnBottomSheetChange: (onBottomSheetChange) => {
        set({ onBottomSheetChange });
      },

      onBottomSheetAnimate: undefined,
      setOnBottomSheetAnimate: (onBottomSheetAnimate) => {
        set({ onBottomSheetAnimate });
      },

      snapPoints: undefined,
      setSnapPoints: (snapPoints?: (string | number)[]) => {
        set({ snapPoints: snapPoints }, false, "setSnapPoints");
      },

      bottomSheetContent: undefined,
      setBottomSheetContent: (content: React.ReactNode) => {
        set({ bottomSheetContent: content });
      },

      bottomSheetAbsoluteBottom: undefined,
      setBottomSheetAbsoluteBottom: (
        bottomSheetAbsoluteBottom: React.ReactNode
      ) => {
        set({ bottomSheetAbsoluteBottom });
      },
    }),
    {
      name: "BottomSheetStore",
    }
  )
);
