import { create } from "zustand";

import {
  BriefSpotInfo,
  SpotInfo,
  SpotsItemInMap,
  SpotTitleList,
  Stories,
  StoryListItem,
  StorySummary,
} from "@/types/storySpot";

import { formatDateArray } from "@/util/dateUtil";

interface StoryStore {
  navigateStorySpotId: number | null;
  setNavigateStorySpotId: (storySpotId: number) => void;
  clearNavigateStorySpotId: () => void;

  setSpotListInMap: (spotLists: SpotsItemInMap[]) => void;
  spotLists: SpotsItemInMap[];

  setStoryListInMap: (storyLists: StoryListItem[]) => void;
  storyLists: StoryListItem[];

  selectedStorySpot: (selectedSpotStoryInfo: SpotInfo[]) => void;

  selectedSpotStoryInfo: SpotInfo[];

  stories?: Stories[];
  briefSpotInfo?: BriefSpotInfo;
  spotTitleList?: SpotTitleList;
  distance?: number;
  summaries?: StorySummary[];

  selectedTitleList?: SpotTitleList;
  setTitleList: (selectedTitleList?: SpotTitleList) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const initialState = {
  briefSpotInfo: undefined,
  mainStoryMapRequest: undefined,
  storyItems: undefined,
  spotTitleList: undefined,
  distance: undefined,
  summaries: undefined,

  selectedStorySpot: undefined,
  selectedSpotStoryInfo: [],

  spotLists: [],
  storyLists: [],

  selectedTitleList: undefined,

  isLoading: true,
};

export const useStoryStore = create<StoryStore>((set, get) => ({
  ...initialState,

  //마커 리스트 정보
  setSpotListInMap: (spotLists: SpotsItemInMap[]) => {
    set({
      spotLists,
    });
  },
  //게시글 리스트 정보
  setStoryListInMap: (storyLists: StoryListItem[]) => {
    const formattedStoryLists = storyLists.map((story) => ({
      ...story,
      createdAt: formatDateArray(story.createdAt),
    }));

    set({
      storyLists: formattedStoryLists,
    });
  },

  setTitleList: (selectedTitleList: SpotTitleList | undefined) => {
    set({ selectedTitleList: selectedTitleList });
  },

  //선택 된 spot
  selectedStorySpot: (selectedSpotStoryInfo: SpotInfo[]) => {
    const selectedSpotInfo = selectedSpotStoryInfo[0];

    if (!selectedSpotInfo) {
      set({
        selectedSpotStoryInfo: [],
        briefSpotInfo: undefined,
        spotTitleList: undefined,
        distance: undefined,
        summaries: undefined,
        stories: undefined,
      });
      return;
    }

    set({
      selectedSpotStoryInfo: selectedSpotStoryInfo,
      briefSpotInfo: selectedSpotInfo.briefSpotInfo,
      spotTitleList: selectedSpotInfo.spotTitleList,
      distance: selectedSpotInfo.distance,
      summaries: selectedSpotInfo.summaries,
      stories: selectedSpotInfo.stories?.map((storyItem) => ({
        ...storyItem,
        createdAt: formatDateArray(storyItem.createdAt),
      })),
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  navigateStorySpotId: null,

  setNavigateStorySpotId: (storySpotId: number) =>
    set({ navigateStorySpotId: storySpotId }),

  clearNavigateStorySpotId: () => set({ navigateStorySpotId: null }),
  setStoryLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
