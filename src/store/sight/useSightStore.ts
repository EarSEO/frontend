import { create } from "zustand";

import { SightDetailInfo, SightInfo } from "@/types/sight";

interface SightState {
  sights: SightInfo[];
  selectedSight: SightInfo | null;
  sightDetail: SightDetailInfo | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;

  setSights: (sights: SightInfo[]) => void;
  selectSight: (sight: SightInfo | null) => void;
  setSightDetail: (detail: SightDetailInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setDetailLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelection: () => void;
  reset: () => void;
}

const initialState = {
  sights: [],
  selectedSight: null,
  sightDetail: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
};

export const useSightStore = create<SightState>((set) => ({
  ...initialState,

  setSights: (sights) => set({ sights, error: null }),

  selectSight: (sight) =>
    set({
      selectedSight: sight,
      sightDetail: null, // 새로운 관광지 선택 시 이전 상세정보 초기화
    }),

  setSightDetail: (detail) => set({ sightDetail: detail }),

  setLoading: (loading) => set({ isLoading: loading }),

  setDetailLoading: (loading) => set({ isDetailLoading: loading }),

  setError: (error) => set({ error }),

  clearSelection: () =>
    set({
      selectedSight: null,
      sightDetail: null,
    }),

  reset: () => set(initialState),
}));
