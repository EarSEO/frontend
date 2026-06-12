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

  isBottomSheetDragg: boolean;
  setIsBottomSheetDragg: (isBottomSheetDragg: boolean) => void;

  onBottomSheetAnimate:
    | ((fromIndex: number, toIndex: number) => void)
    | undefined;
  setOnBottomSheetAnimate: (
    onBottomSheetAnimate: (fromIndex: number, toIndex: number) => void
  ) => void;

  snapPoints: (string | number)[];
  index: number;
  setBottomSheetLayout: (params: {
    snapPoints: (string | number)[];
    index: number;
  }) => void;

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
      isBottomSheetDragg: true,
      setIsBottomSheetDragg: (isBottomSheetDragg: boolean) => {
        set({ isBottomSheetDragg }, false, "setIsBottomSheetDragg");
      },
      onBottomSheetChange: undefined,
      setOnBottomSheetChange: (onBottomSheetChange) => {
        set({ onBottomSheetChange });
      },

      onBottomSheetAnimate: undefined,
      setOnBottomSheetAnimate: (onBottomSheetAnimate) => {
        set({ onBottomSheetAnimate });
      },

      snapPoints: ["15%", "45%", "75%", "100%"],
      index: 1,
      setBottomSheetLayout: ({ snapPoints, index }) => {
        const maxIndex = snapPoints.length - 1;
        const safeIndex = Math.max(-1, Math.min(index, maxIndex));

        set(
          {
            snapPoints,
            index: safeIndex,
          },
          false,
          "setBottomSheetLayout"
        );
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
