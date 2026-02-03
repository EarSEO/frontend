import { create } from "zustand";

interface HeaderButtonStore {
  buttonStyle: "CIRCLE" | "NONE";
  showBackButton: boolean;
  showCloseButton: boolean;
  onBackPress: (() => void) | undefined;
  onClosePress: (() => void) | undefined;

  setButtonStyle: (style: "CIRCLE" | "NONE") => void;
  setShowBackButton: (show: boolean) => void;
  setShowCloseButton: (show: boolean) => void;
  setOnBackPress: (handler: (() => void) | undefined) => void;
  setOnClosePress: (handler: (() => void) | undefined) => void;
  reset: () => void;
}

export const useHeaderButtonStore = create<HeaderButtonStore>((set) => ({
  buttonStyle: "NONE",
  showBackButton: false,
  showCloseButton: false,
  onBackPress: undefined,
  onClosePress: undefined,

  setButtonStyle: (style) => set({ buttonStyle: style }),
  setShowBackButton: (show) => set({ showBackButton: show }),
  setShowCloseButton: (show) => set({ showCloseButton: show }),
  setOnBackPress: (handler) => set({ onBackPress: handler }),
  setOnClosePress: (handler) => set({ onClosePress: handler }),

  reset: () =>
    set({
      buttonStyle: "NONE",
      showBackButton: false,
      showCloseButton: false,
      onBackPress: undefined,
      onClosePress: undefined,
    }),
}));
