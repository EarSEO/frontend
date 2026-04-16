import { LatLng } from "react-native-maps/src/sharedTypes";

import { create } from "zustand";

import { SpotInfo, storySpots } from "@/types/storySpot";

export type StoryAddStep = "none" | "location" | "name" | "storyAdd";

interface storyAddStore {
  newSpotName?: string;
  setNewSpotName: (newSpotName?: string) => void;

  markedLocation?: LatLng;
  setStoryLocation: (markedLocation?: LatLng) => void;

  storyAddStep: StoryAddStep;
  setStoryAddStep: (step: StoryAddStep) => void;

  // setSavedSpot: (selectedSpot?: storySpots) => void;
  // resetSavedSpot: () => void;
  selectedSpot?: storySpots;

  onStoryAdd: boolean;
  setOnStoryAdd: (onStoryAdd: boolean) => void;
}

export const useStoryAddStore = create<storyAddStore>((set, get) => ({
  storyLocation: undefined,
  newSpotName: undefined,
  selectedSpotTitle: undefined,
  storyAddStep: "none",
  markedLocation: undefined,

  //이야기 등록 시 새로운 스토리 이름 저장
  setNewSpotName: (newSpotName?: string) => {
    if (!newSpotName) {
      set({ newSpotName: undefined });
    } else {
      set({ newSpotName: newSpotName });
    }
  },

  setStoryLocation: (markedLocation?: LatLng) => {
    if (!markedLocation) {
      set({ markedLocation: undefined });
    } else {
      set({ markedLocation: markedLocation });
    }
  },

  setStoryAddStep: (storyAddStep: StoryAddStep) => set({ storyAddStep }),

  // 기존 이야기 정보저장
  // setSavedSpot: (selectedSpot?: storySpots) =>
  //   set({
  //     selectedSpot,
  //   }),
  // resetSavedSpot: () => set({ selectedSpot: undefined }),

  onStoryAdd: false,
  setOnStoryAdd: (onStoryAdd: boolean) => {
    set({ onStoryAdd });
  },
}));
