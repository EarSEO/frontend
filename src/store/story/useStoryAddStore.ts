import { Address } from "react-native-maps";
import { LatLng } from "react-native-maps/src/sharedTypes";

import { create } from "zustand";

export type StoryAddStep = "none" | "location" | "name" | "storyAdd";

interface storyAddStore {
  newSpotName?: string;
  setNewSpotName: (newSpotName?: string) => void;

  addStoryLocation?: LatLng;
  setStoryLocation: (addStoryLocation?: LatLng) => void;

  storyAddStep: StoryAddStep;
  setStoryAddStep: (step: StoryAddStep) => void;

  pinAddress?: Address | undefined;
  setPinAddress: (pinAddress: Address | undefined) => void;

  onStoryAdd: boolean;
  setOnStoryAdd: (onStoryAdd: boolean) => void;
}

export const useStoryAddStore = create<storyAddStore>((set, get) => ({
  storyLocation: undefined,
  newSpotName: undefined,
  selectedSpotTitle: undefined,
  storyAddStep: "none",
  addStoryLocation: undefined,
  pinAddress: undefined,

  //이야기 등록 시 새로운 스토리 이름 저장
  setNewSpotName: (newSpotName?: string) => {
    if (!newSpotName) {
      set({ newSpotName: undefined });
    } else {
      set({ newSpotName: newSpotName });
    }
  },

  setStoryLocation: (addStoryLocation?: LatLng) => {
    if (!addStoryLocation) {
      set({ addStoryLocation: undefined });
    } else {
      set({ addStoryLocation: addStoryLocation });
    }
  },

  setPinAddress: (pinAddress: Address | undefined) => set({ pinAddress }),

  setStoryAddStep: (storyAddStep: StoryAddStep) => set({ storyAddStep }),

  onStoryAdd: false,
  setOnStoryAdd: (onStoryAdd: boolean) => {
    set({ onStoryAdd });
  },
}));
