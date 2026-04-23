import { create } from "zustand";

import { useLikedStory } from "@/hooks/story/useLikedStory";

import { ToggleLikeResponse } from "@/types/myStory";
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
  StoryItem,
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
import { toggleStoryLike as toggleStoryLikeApi } from "@/api/story/getMyStoryApi";

interface StoryStore {
  storyItems?: StoryItem[];
  briefSpotInfo?: SpotInfoResponse;
  mainStoryMapRequest?: GetMapStoriesRequest;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  summaries?: StorySummaryResponse[];
  storyListInMap?: StoryInfoResponse[];
  storySpotBriefInfo?: GetLocationSpotBriefInfoResponse;
  newSpotLocation?: GetSpotBriefInfoRequest[];
  searchedStoryInfo?: storySpots[];
  spotLocationInMap?: MapSpotInfoItem[];
  isLoading: boolean;
  loading: boolean;
  toggleStoryLike: (storyId: number) => Promise<void>;
  toggleStoryListLike: (storyId: number) => Promise<void>;

  navigateStorySpotId: number | null;
  setNavigateStorySpotId: (storySpotId: number) => void;
  clearNavigateStorySpotId: () => void;

  setSearchStory: (
    param: GetSearchTitleRequest
  ) => Promise<SearchSpotInfoResponse | undefined>;
  resetSearchStory: () => void;

  setStoryInfo: (
    param: GetStoryRequest
  ) => Promise<GetSpotTotalInfoResponse | undefined>;
  resetStoryInfo: () => void;

  setStoryListInMap: (
    param: GetMapStoriesRequest
  ) => Promise<StoryInfoResponse | undefined>;

  setStorySpotBriefInfo: (
    param: GetSpotBriefInfoRequest
  ) => Promise<GetLocationSpotBriefInfoResponse | undefined>;

  resetStorySpotInfo: () => void;

  setStoryLocationInMap: (
    param: GetMapStoriesRequest
  ) => Promise<MapSpotInfoItem[] | undefined>;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  briefSpotInfo: undefined,
  mainStoryMapRequest: undefined,
  storyItems: undefined,
  spotTitleList: undefined,
  distance: undefined,
  summaries: undefined,
  storyListInMap: undefined,
  storyMain: true,
  storySpotBriefInfo: undefined,
  spotLocationInMap: undefined,
  searchedStoryInfo: undefined,
  isLoading: true,
  loading: true,

  //마커 선택 시 이야기게시글 불러오기
  setStoryInfo: async (
    param: GetStoryRequest
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
          storyId: storyItem.storyId,
          isLiked: storyItem.isLiked,
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
  setStoryListInMap: async (
    param: GetMapStoriesRequest
  ): Promise<GetMapStoryResponse | undefined> => {
    try {
      const response: GetMapStoryResponse = await getStoryListInMap(param);
      set({
        storyListInMap: response.stories?.map((storyInMap) => ({
          ...storyInMap,
          createdAt: formatDateArray(storyInMap.createdAt),
        })),
      });
      return response;
    } catch (error) {
      set({ storyListInMap: undefined });
      return undefined;
    }
  },

  //스팟 위치 정보 -> 관련 스팟 이름,id 가져오기
  setStorySpotBriefInfo: async (
    param: GetSpotBriefInfoRequest
  ): Promise<GetLocationSpotBriefInfoResponse | undefined> => {
    try {
      const response: GetLocationSpotBriefInfoResponse =
        await getStorySpotBriefInfo(param);
      set({
        storySpotBriefInfo: response,
      });
      return response;
    } catch (error) {
      set({ storySpotBriefInfo: undefined });
      return undefined;
    }
  },
  resetStorySpotInfo: () => {
    set({
      storySpotBriefInfo: undefined,
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

  //지도 사각형 내 스팟 마커 조회
  setStoryLocationInMap: async (
    param: GetMapStoriesRequest
  ): Promise<MapSpotInfoItem[] | undefined> => {
    try {
      const response: MapSpotInfoList = await getStorySpotListInMap(param);
      set({
        spotLocationInMap: response.storySpots,
        mainStoryMapRequest: param,
      });
      return response.storySpots;
    } catch (error) {
      set({ searchedStoryInfo: undefined });
      return undefined;
    }
  },

  navigateStorySpotId: null,

  setNavigateStorySpotId: (storySpotId: number) => set({ navigateStorySpotId: storySpotId }),

  clearNavigateStorySpotId: () => set({ navigateStorySpotId: null }),
  setStoryLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  toggleStoryLike: async (storyId: number) => {
    const currentItems = get().storyItems;
    if (!currentItems) return;

    const current = currentItems.find((s) => s.storyId === storyId);
    if (!current) return;

    const prevIsLiked = !!current.isLiked;
    const prevCount = current.likeCount ?? 0;
    const nextIsLiked = !prevIsLiked;
    const nextCount = prevIsLiked ? Math.max(0, prevCount - 1) : prevCount + 1;

    set({
      storyItems: currentItems.map((st) =>
        st.storyId === storyId
          ? { ...st, isLiked: nextIsLiked, likeCount: nextCount }
          : st
      ),
    });

    try {
      const res = (await toggleStoryLikeApi(storyId)) as ToggleLikeResponse;

      set((s) => ({
        storyItems: s.storyItems?.map((st) =>
          st.storyId === storyId
            ? { ...st, isLiked: res.isLiked, likeCount: res.likeCount }
            : st
        ),
      }));

      useLikedStory.getState().syncLikeState(storyId, res.isLiked, res.likeCount);
    } catch (e) {
      set((s) => ({
        storyItems: s.storyItems?.map((st) =>
          st.storyId === storyId
            ? { ...st, isLiked: prevIsLiked, likeCount: prevCount }
            : st
        ),
      }));
      console.error("이야기 탭 좋아요 토글 실패:", e);
    }
  },

  toggleStoryListLike: async (storyId: number) => {
    const currentItems = get().storyListInMap;
    if (!currentItems) return;

    const current = currentItems.find((s) => s.storyId === storyId);
    if (!current) return;

    const prevIsLiked = !!current.isLiked;
    const prevCount = current.likeCount ?? 0;
    const nextIsLiked = !prevIsLiked;
    const nextCount = prevIsLiked ? Math.max(0, prevCount - 1) : prevCount + 1;

    set({
      storyListInMap: currentItems.map((st) =>
        st.storyId === storyId
          ? { ...st, isLiked: nextIsLiked, likeCount: nextCount }
          : st
      ),
    });

    try {
      const res = (await toggleStoryLikeApi(storyId)) as ToggleLikeResponse;

      set((s) => ({
        storyListInMap: s.storyListInMap?.map((st) =>
          st.storyId === storyId
            ? { ...st, isLiked: res.isLiked, likeCount: res.likeCount }
            : st
        ),
      }));

      useLikedStory.getState().syncLikeState(storyId, res.isLiked, res.likeCount);
    } catch (e) {
      set((s) => ({
        storyListInMap: s.storyListInMap?.map((st) =>
          st.storyId === storyId
            ? { ...st, isLiked: prevIsLiked, likeCount: prevCount }
            : st
        ),
      }));
      console.error("메인 이야기 좋아요 토글 실패:", e);
    }
  },
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
  if (typeof dateArray === "string") return dateArray;
  if (!dateArray || !Array.isArray(dateArray)) return "";

  const [year, month, day, hour, minute] = dateArray;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
