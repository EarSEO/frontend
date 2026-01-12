import { create } from "zustand";

import {
  GetLocationSpotBriefInfoResponse as StorySpotInfoResponse,
  GetMapStoriesRequest as GetStoriesInMapRequest,
  GetMapStoryResponse,
  GetSearchTitleRequest as GetSearchStoryRequest,
  GetSpotBriefInfoRequest as GetStorySpotInfoRequest,
  GetSpotTotalInfoResponse,
  GetStoryRequest as GetStoryMarkerInfoRequest,
  MapSpotInfoItem,
  MapSpotInfoList,
  SearchSpotInfoResponse as SearchStoryInfoResponse,
  SpotInfoResponse,
  SpotTitleListResponse,
  StoryInfoResponse,
  storySpots,
  StorySummaryResponse,
} from "@/types/storySpot";

import {
  getSearchStory,
  getStoryInfo,
  getStoryListInMap,
  getStorySpotBriefInfo,
  getStorySpotListInMap,
} from "@/api/getStoryApi";

interface StoryStore {
  storyItems?: StoryItem[];
  briefSpotInfo?: SpotInfoResponse;
  mainStoryMapRequest?: GetStoriesInMapRequest;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  summaries?: StorySummaryResponse[];
  storiesInMap?: StoryInfoResponse[];
  storySpotInfo?: StorySpotInfoResponse;
  newSpotLocation?: GetStorySpotInfoRequest[];
  searchedStoryInfo?: storySpots[];
  spotLocationInMao?: MapSpotInfoItem[];

  setSearchStory: (
    param: GetSearchStoryRequest
  ) => Promise<SearchStoryInfoResponse | undefined>;
  resetSearchStory: () => void;

  setStoryMarkerInfo: (
    param: GetStoryMarkerInfoRequest
  ) => Promise<GetSpotTotalInfoResponse | undefined>;
  resetStoryMarkerInfo: () => void;

  setStoriesInMap: (
    param: GetStoriesInMapRequest
  ) => Promise<StoryInfoResponse | undefined>;

  setStorySpotInfo: (
    param: GetStorySpotInfoRequest
  ) => Promise<StorySpotInfoResponse | undefined>;
  resetStorySpotInfo: () => void;

  setStoryLocationInMap: (
    param: GetStoriesInMapRequest
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
  storiesInMap: undefined,
  storyMain: true,
  storySpotInfo: undefined,
  spotLocationInMao: undefined,
  searchedStoryInfo: undefined,

  //마커 선택 시 이야기게시글 불러오기
  setStoryMarkerInfo: async (
    param: GetStoryMarkerInfoRequest
  ): Promise<GetSpotTotalInfoResponse | undefined> => {
    try {
      const response: GetSpotTotalInfoResponse = await getStoryInfo(param);
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
  resetStoryMarkerInfo: () =>
    set({
      storyItems: undefined,
      briefSpotInfo: undefined,
      spotTitleList: undefined,
      distance: undefined,
      summaries: undefined,
    }),

  //지도 사각형 영역 내 이야기 게시글 조회
  setStoriesInMap: async (
    param: GetStoriesInMapRequest
  ): Promise<GetMapStoryResponse | undefined> => {
    try {
      const response: GetMapStoryResponse = await getStoryListInMap(param);
      set({
        storiesInMap: response.stories?.map((mapStory) => ({
          ...mapStory,
          createdAt: formatDateArray(mapStory.createdAt),
        })),
      });
      return response;
    } catch (error) {
      set({ storiesInMap: undefined });
      return undefined;
    }
  },

  //스팟 위치 정보 -> 관련 스팟 이름,id 가져오기
  setStorySpotInfo: async (
    param: GetStorySpotInfoRequest
  ): Promise<StorySpotInfoResponse | undefined> => {
    try {
      const response: StorySpotInfoResponse =
        await getStorySpotBriefInfo(param);
      set({
        storySpotInfo: response,
      });
      return response;
    } catch (error) {
      set({ storySpotInfo: undefined });
    }
  },
  resetStorySpotInfo: () => {
    set({
      storySpotInfo: undefined,
    });
  },

  //스토리 검색
  setSearchStory: async (
    param: GetSearchStoryRequest
  ): Promise<SearchStoryInfoResponse | undefined> => {
    try {
      const response: SearchStoryInfoResponse = await getSearchStory(param);
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

  //지도 사각형 내 스팟 마커 조회
  setStoryLocationInMap: async (
    param: GetStoriesInMapRequest
  ): Promise<MapSpotInfoItem[] | undefined> => {
    try {
      const response: MapSpotInfoList = await getStorySpotListInMap(param);
      set({
        spotLocationInMao: response.storySpots,
        mainStoryMapRequest: param,
      });
      return response.storySpots;
    } catch (error) {
      set({ searchedStoryInfo: undefined });
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
