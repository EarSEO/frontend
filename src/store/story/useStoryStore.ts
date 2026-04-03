import { create } from "zustand";

import {
  BriefSpotInfo,
  GetSearchTitleRequest,
  SearchSpotInfoResponse,
  SpotInfo,
  SpotsItemInMap,
  SpotTitleList,
  StoryItems,
  StoryListItem,
  storySpots,
  StorySummary,
} from "@/types/storySpot";

import { getSearchStory } from "@/api/getStoryApi";

interface StoryStore {
  isLoading: boolean;

  setSpotListInMap: (spotLists: SpotsItemInMap[]) => void;
  spotLists: SpotsItemInMap[];

  setStoryListInMap: (storyLists: StoryListItem[]) => void;
  storyLists: StoryListItem[];

  selectedStorySpot: (selectedSpotStoryInfo: SpotInfo[]) => void;

  setSearchStory: (
    param: GetSearchTitleRequest
  ) => Promise<SearchSpotInfoResponse | undefined>;
  selectedSpotStoryInfo: SpotInfo[];
  searchedStoryInfo?: storySpots[];

  storyItems?: StoryItems[];
  briefSpotInfo?: BriefSpotInfo;
  spotTitleList?: SpotTitleList;
  distance?: number;
  summaries?: StorySummary[];

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

  isLoading: true,

  searchedStoryInfo: undefined,
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
        storyItems: undefined,
      });
      return;
    }

    set({
      selectedSpotStoryInfo,
      briefSpotInfo: selectedSpotInfo.briefSpotInfo,
      spotTitleList: selectedSpotInfo.spotTitleList,
      distance: selectedSpotInfo.distance,
      summaries: selectedSpotInfo.summaries,
      storyItems: selectedSpotInfo.storyItems?.map((storyItem) => ({
        ...storyItem,
        createdAt: formatDateArray(storyItem.createdAt),
      })),
    });
  },

  //스토리 검색
  setSearchStory: async (
    param: GetSearchTitleRequest
  ): Promise<SearchSpotInfoResponse | undefined> => {
    try {
      const response: SearchSpotInfoResponse = await getSearchStory(param);
      set({
        searchedStoryInfo: response.storySpots,
      });
      return response;
    } catch (error) {
      set({ searchedStoryInfo: undefined });
      return undefined;
    }
  },

  resetSearchStory: () => {
    set({ searchedStoryInfo: undefined });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
  if (typeof dateArray === "string") return dateArray;
  if (!dateArray || !Array.isArray(dateArray)) return "";

  const [year, month, day, hour, minute] = dateArray;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
