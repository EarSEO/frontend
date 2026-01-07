import { create } from "zustand";

interface storyAddStore {
  newSpotName?: string;

  setNewSpotName: (name: string | undefined) => void;
  setStoryLocation: (latitude: number, longitude: number) => void;
  storyLocation?: { latitude: number; longitude: number };
}

export const useStoryAddStore = create<storyAddStore>((set, get) => ({
  storyLocation: undefined,
  newSpotName: undefined,

  //이야기 등록 시 새로운 스토리 이름 저장
  setNewSpotName: (name: string | undefined) => set({ newSpotName: name }),

  //이야기 등록 시 스토리 위치 정보 저장
  setStoryLocation: (latitude: number, longitude: number) =>
    set({
      storyLocation: {
        latitude,
        longitude,
      },
    }),
}));
