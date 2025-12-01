import { create } from "zustand";

import {
  GetLocationSpotBriefInfoResponse,
  GetMapStoriesRequest,
  GetMapStoryResponse,
  GetSearchTitleRequest,
  GetSpotBriefInfoRequest,
  GetSpotTotalInfoResponse,
  GetStoryRequest,
  SearchSpotInfoResponse,
  SpotInfoResponse,
  SpotTitleListResponse,
  StoryInfoResponse,
  storySpots,
  StorySummaryResponse,
} from "@/types/storySpot";

import {
  getRectangle,
  getSearchTitle,
  getSpotBriefInfo,
  getStoryApi,
} from "@/api/getStoryApi";

interface StoryStore {
  storyMain?: boolean;
  storyItems?: StoryItem[];
  briefSpotInfo?: SpotInfoResponse;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  summaries?: StorySummaryResponse[];
  mapStoryInfo?: StoryInfoResponse[];
  spotBriefInfo?: GetLocationSpotBriefInfoResponse;
  newSpotName?: string;
  newSpotLocation?: GetSpotBriefInfoRequest[];
  storyLocation?: { latitude: number; longitude: number };
  searchTitleInfo?: storySpots[];

  setStoryInfo: (
    param: GetStoryRequest
  ) => Promise<GetSpotTotalInfoResponse | undefined>;
  setMapStoryInfo: (
    param: GetMapStoriesRequest
  ) => Promise<StoryInfoResponse | undefined>;
  setSpotBriefInfo: (
    param: GetSpotBriefInfoRequest
  ) => Promise<GetLocationSpotBriefInfoResponse | undefined>;
  setNewSpotName: (name: string) => void;
  setStoryLocation: (latitude: number, longitude: number) => void;
}

interface StoryItem {
  storyAuthor?: {
    storyAuthorId?: number;
    nickname?: string;
    profileUrl?: string;
  };

  title?: string;
  content?: string;
  locale?: "KO" | "EN";
  storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  likeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrls?: string[];
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  briefSpotInfo: undefined,
  storyItems: undefined,
  spotTitleList: undefined,
  distance: undefined,
  summaries: undefined,
  mapStoryInfo: undefined,
  storyMain: true,
  spotBriefInfo: undefined,
  newSpotName: undefined,
  storyLocation: undefined,
  searchTitleInfo: undefined,

  setStoryInfo: async (
    param: GetStoryRequest
  ): Promise<GetSpotTotalInfoResponse | undefined> => {
    try {
      const response: GetSpotTotalInfoResponse = await getStoryApi(param);
      set({
        storyMain: false,
        briefSpotInfo: response.briefSpotInfo,
        spotTitleList: response.spotTitleList,
        distance: response.distance,
        summaries: response.summaries,
        storyItems: response.stories?.map((storyItem) => ({
          ...storyItem,
          createdAt: formatDateArray(storyItem.createdAt),
        })),
      });
      return response;
    } catch (error) {
      set({ storyItems: undefined });
      return undefined;
    }
  },

  setMapStoryInfo: async (
    param: GetMapStoriesRequest
  ): Promise<GetMapStoryResponse | undefined> => {
    try {
      const response: GetMapStoryResponse = await getRectangle(param);
      console.log(response.stories);
      set({
        storyMain: true,
        mapStoryInfo: response.stories?.map((mapStory) => ({
          ...mapStory,
          createdAt: formatDateArray(mapStory.createdAt),
        })),
      });
      return response;
    } catch (error) {
      set({ mapStoryInfo: undefined });
      return undefined;
    }
  },

  //스팟 이름 검색 -> 관련 스팟 이름 가져오기
  setSpotBriefInfo: async (
    param: GetSpotBriefInfoRequest
  ): Promise<GetLocationSpotBriefInfoResponse | undefined> => {
    try {
      const response: GetLocationSpotBriefInfoResponse =
        await getSpotBriefInfo(param);
      set({
        spotBriefInfo: response,
      });
      return response;
    } catch (error) {
      set({ spotBriefInfo: undefined });
    }
  },

  setNewSpotName: (name: string) => set({ newSpotName: name }),

  setStoryLocation: (latitude: number, longitude: number) =>
    set({
      storyLocation: {
        latitude,
        longitude,
      },
    }),

  setSearchTitle: async (
    param: GetSearchTitleRequest
  ): Promise<SearchSpotInfoResponse | undefined> => {
    try {
      const response: SearchSpotInfoResponse = await getSearchTitle(param);
      set({
        searchTitleInfo: response.storySpots,
      });
      return response;
    } catch (error) {
      set({ searchTitleInfo: undefined });
    }
  },
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
  if (typeof dateArray === "string") return dateArray;
  if (!dateArray || !Array.isArray(dateArray)) return "";

  const [year, month, day, hour, minute] = dateArray;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
