import { create } from "zustand";

import { CurationSightList, SightDetailInfo, SightInfo } from "@/types/sight";
import {
  BriefSpotInfo,
  SpotTitleList,
  Stories,
  StorySummary,
} from "@/types/storySpot";

interface SightState {
  sights: SightInfo[];
  selectedSight: SightInfo | undefined;
  sightDetail: SightDetailInfo | undefined;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | undefined;
  curationSightList: CurationSightList[] | undefined;

  stories?: Stories[];
  briefSpotInfo?: BriefSpotInfo;
  spotTitleList?: SpotTitleList;
  distance?: number;
  summaries?: StorySummary[];

  setSights: (sights: SightInfo[]) => void;
  selectSight: (sight: SightInfo | undefined) => void;
  setSightDetail: (detail: SightDetailInfo | undefined) => void;
  setLoading: (loading: boolean) => void;
  setDetailLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  clearSelection: () => void;
  reset: () => void;
  setCurationSightList: (
    curationSightList: CurationSightList[] | undefined
  ) => void;
}

const initialState = {
  sights: [],
  selectedSight: undefined,
  sightDetail: undefined,
  isLoading: false,
  isDetailLoading: false,
  error: undefined,
  curationSightList: undefined,
};

export const useSightStore = create<SightState>((set) => ({
  ...initialState,

  setSights: (sights) => set({ sights, error: undefined }),

  selectSight: (sight) =>
    set({
      selectedSight: sight,
      sightDetail: undefined, // 새로운 관광지 선택 시 이전 상세정보 초기화
    }),

  setSightDetail: (detail) => set({ sightDetail: detail }),

  setLoading: (loading) => set({ isLoading: loading }),

  setDetailLoading: (loading) => set({ isDetailLoading: loading }),

  setError: (error) => set({ error }),

  clearSelection: () =>
    set({
      selectedSight: undefined,
      sightDetail: undefined,
    }),

  reset: () => set(initialState),

  //curationList
  setCurationSightList: (curationSightList: CurationSightList[] | undefined) =>
    set({ curationSightList: curationSightList }),
}));
