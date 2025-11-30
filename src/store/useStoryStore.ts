import { create } from "zustand";

import {
  GetMapStoriesRequest,
  GetMapStoryResponse,
  GetSpotTotalInfoResponse,
  GetStoryRequest,
  SpotInfoResponse,
  SpotTitleListResponse,
  StoryInfoResponse,
  StorySummaryResponse,
} from "@/types/storySpot";

import { getRectangle, getStoryApi } from "@/api/getStoryApi";

interface StoryStore {
  storyMain?: boolean;
  storyItems?: StoryItem[];
  briefSpotInfo?: SpotInfoResponse;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  summaries?: StorySummaryResponse[];
  mapStoryInfo?: StoryInfoResponse[];

  setStoryInfo: (
    param: GetStoryRequest
  ) => Promise<GetSpotTotalInfoResponse | undefined>;
  setMapStoryInfo: (
    param: GetMapStoriesRequest
  ) => Promise<StoryInfoResponse | undefined>;
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

export const useStoryStore = create<StoryStore>((set) => ({
  briefSpotInfo: undefined,
  storyItems: undefined,
  spotTitleList: undefined,
  distance: undefined,
  summaries: undefined,
  mapStoryInfo: undefined,
  storyMain: true,

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
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
  if (typeof dateArray === "string") return dateArray;
  if (!dateArray || !Array.isArray(dateArray)) return "";

  const [year, month, day, hour, minute] = dateArray;
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
