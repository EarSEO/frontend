export interface GetSpotTotalInfoResponse {
  briefSpotInfo?: SpotInfoResponse;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  stories?: StoryInfoResponse[];
  summaries?: StorySummaryResponse[];
}

export interface GetMapStoryResponse {
  stories?: StoryInfoResponse[];
  number?: number;
  size?: number;
  isFirst?: boolean;
  isLast?: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface GetLocationSpotBriefInfoResponse {
  spotId?: number;
  titles?: string[];
}

export interface SpotInfoResponse {
  longitude?: number;
  latitude?: number;
  storySpotId?: number;
}

export interface SpotTitleListResponse {
  titles?: string[];
}

export interface StoryAuthorResponse {
  storyAuthorId: number;
  nickname?: string;
  profileUrl?: string;
}

export interface StoryInfoResponse {
  storyAuthor?: StoryAuthorResponse;
  title?: string;
  content?: string;
  locale?: "KO" | "EN";
  storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  likeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrls?: string[];
}

export interface StorySummaryResponse {
  storySpotSummaryId?: number;
  storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  docentUrl?: string;
  title?: string;
  summary?: string;
  summarizedStoryIdSet?: number[];
  updatedAt?: string;
}

export interface GetStoryRequest {
  storySpotId: number;
  query: {
    query: {
      longitude: string;
      latitude: string;
      locale: "KO" | "EN";
      page?: number;
      size?: number;
      sort?:
        | "createdAt,desc"
        | "createdAt,asc"
        | "likeCount,desc"
        | "likeCount,asc";
    };
  };
}

export interface GetMapStoriesRequest {
  minLongitude: string;
  minLatitude: string;
  maxLongitude: string;
  maxLatitude: string;
  page: number;
  size: number;
  sort: string;
}

export interface StoryData {
  stories: StoryInfoResponse[];
  number: number;
  size: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetSpotBriefInfoRequest {
  longitude: string;
  latitude: string;
}

export interface CreateStoryRequest {
  authorId: number;
  authorName: string;
  authorProfileUrl: string;
  authorProfileUpdatedAt: string;
  latitude: number;
  longitude: number;
  title: string;
  content: string;
  storyConcept: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  locale: "KO" | "EN";
}

export interface CreateStoryResponse {
  storyId: number;
  storySpotId: number;
  createdAt: string;
}

export interface GetSearchTitleRequest {
  keyword: string;
  longitude: number;
  latitude: number;
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
  limit?: string;
}

export interface storySpots {
  longitude: number;
  latitude: number;
  storySpotId: number;
  distance?: number;
  title?: string;
}

export interface SearchSpotInfoResponse {
  storySpots: storySpots[];
}

export interface MapSpotInfoList {
  storySpots: MapSpotInfoItem[];
}

export interface MapSpotInfoItem {
  longitude: number;
  latitude: number;
  storySpotId: number;
}
