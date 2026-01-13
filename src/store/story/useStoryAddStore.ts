import { create } from "zustand";

interface storyAddStore {
  newSpotName?: string;
  setNewSpotName: (name: string | undefined) => void;
  resetNewSpotName: () => void;

  setStoryLocation: (latitude: number, longitude: number) => void;
  resetStoryLocation: () => void;
  storyLocation?: { latitude: number; longitude: number };

  setSavedStorySpot: (
    id: number | undefined,
    title: string | undefined
  ) => void;
  resetSavedStorySpot: () => void;
  selectedSpotId?: number;
  selectedSpotTitle?: string;
}

export const useStoryAddStore = create<storyAddStore>((set, get) => ({
  storyLocation: undefined,
  newSpotName: undefined,
  selectedSpotTitle: undefined,

  //이야기 등록 시 새로운 스토리 이름 저장
  setNewSpotName: (name: string | undefined) => set({ newSpotName: name }),
  resetNewSpotName: () => set({ newSpotName: undefined }),

  //기존 이야기 정보저장
  setSavedStorySpot: (id: number | undefined, title: string | undefined) =>
    set({
      selectedSpotId: id,
      selectedSpotTitle: title,
    }),
  resetSavedStorySpot: () =>
    set({ selectedSpotId: undefined, selectedSpotTitle: undefined }),

  //이야기 등록 시 스토리 위치 정보 저장
  setStoryLocation: (latitude: number, longitude: number) =>
    set({
      storyLocation: {
        latitude,
        longitude,
      },
    }),
  resetStoryLocation: () =>
    set({
      storyLocation: undefined,
    }),
}));
