import { create } from "zustand";

import {
  GetLocationSpotBriefInfoResponse,
  GetMapStoriesRequest,
  GetMapStoryResponse,
  GetSearchTitleRequest,
  GetSpotBriefInfoRequest,
  GetSpotTotalInfoResponse,
  GetStoryRequest,
  MapSpotInfoItem,
  MapSpotInfoList,
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
  getSpotMapRectangle,
  getStoryApi,
} from "@/api/getStoryApi";

interface StoryStore {
  storyItems?: StoryItem[];
  briefSpotInfo?: SpotInfoResponse;
  mainStoryMapRequest?: GetMapStoriesRequest;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  summaries?: StorySummaryResponse[];
  mapStoryInfo?: StoryInfoResponse[];
  spotBriefInfo?: GetLocationSpotBriefInfoResponse;
  newSpotLocation?: GetSpotBriefInfoRequest[];
  searchTitleInfo?: storySpots[];
  spotMapRectangle?: MapSpotInfoItem[];

  setSearchTitle: (
    param: GetSearchTitleRequest
  ) => Promise<SearchSpotInfoResponse | undefined>;
  resetSearchTitle: () => void;
  setStoryInfo: (
    param: GetStoryRequest
  ) => Promise<GetSpotTotalInfoResponse | undefined>;
  resetStoryInfo: () => void;
  setMapStoryInfo: (
    param: GetMapStoriesRequest
  ) => Promise<StoryInfoResponse | undefined>;
  setSpotBriefInfo: (
    param: GetSpotBriefInfoRequest
  ) => Promise<GetLocationSpotBriefInfoResponse | undefined>;
  setSpotMapRectangle: (
    param: GetMapStoriesRequest
  ) => Promise<MapSpotInfoItem[] | undefined>;
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
  mainStoryMapRequest: undefined,
  storyItems: undefined,
  spotTitleList: undefined,
  distance: undefined,
  summaries: undefined,
  mapStoryInfo: undefined,
  storyMain: true,
  spotBriefInfo: undefined,
  spotMapRectangle: undefined,
  searchTitleInfo: undefined,

  //마커 선택 시 이야기게시글 불러오기
  setStoryInfo: async (
    param: GetStoryRequest
  ): Promise<GetSpotTotalInfoResponse | undefined> => {
    try {
      const response: GetSpotTotalInfoResponse = await getStoryApi(param);
      set({
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
  resetStoryInfo: () =>
    set({
      storyItems: undefined,
      briefSpotInfo: undefined,
      spotTitleList: undefined,
      distance: undefined,
      summaries: undefined,
    }),

  //지도 사각형 영역 내 이야기 게시글 조회
  setMapStoryInfo: async (
    param: GetMapStoriesRequest
  ): Promise<GetMapStoryResponse | undefined> => {
    try {
      const response: GetMapStoryResponse = await getRectangle(param);
      set({
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

  //스토리 검색
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
      return undefined;
    }
  },

  resetSearchTitle: () => {
    set({ searchTitleInfo: undefined });
  },

  //지도 사각형 내 스팟 마커 조회
  setSpotMapRectangle: async (
    param: GetMapStoriesRequest
  ): Promise<MapSpotInfoItem[] | undefined> => {
    try {
      const response: MapSpotInfoList = await getSpotMapRectangle(param);
      set({
        spotMapRectangle: response.storySpots,
        mainStoryMapRequest: param,
      });
      return response.storySpots;
    } catch (error) {
      set({ searchTitleInfo: undefined });
      return undefined;
    }
  },
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
  if (typeof dateArray === "string") return dateArray;
  if (!dateArray || !Array.isArray(dateArray)) return "";

  const [year, month, day, hour, minute] = dateArray;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
