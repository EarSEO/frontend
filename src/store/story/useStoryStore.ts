import { create } from "zustand";

import {
  BriefSpotInfo,
  SpotInfo,
  SpotsItemInMap,
  SpotTitleList,
  Stories,
  StoryListItem,
  storySpots,
  StorySummary,
} from "@/types/storySpot";

interface StoryStore {
  isLoading: boolean;

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

  searchedSpot?: storySpots;
  setSearchedSpot: (searchedSpot?: storySpots) => void;

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
  searchedSpot: undefined,

  spotLists: [],
  storyLists: [],

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

  setSearchedSpot: (searchedSpot?: storySpots) => {
    if (!searchedSpot) {
      set({ searchedSpot: undefined });
    } else {
      set({ searchedSpot: searchedSpot });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
  if (typeof dateArray === "string") return dateArray;
  if (!dateArray || !Array.isArray(dateArray)) return "";

  const [year, month, day, hour, minute] = dateArray;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
