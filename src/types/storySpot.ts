export interface GetLocationSpotBriefInfoResponse {
  spotId?: number;
  titles?: string[];
}

export interface StoryAuthorResponse {
  storyAuthorId: number;
  nickname?: string;
  profileUrl?: string;
}

export interface StoryData {
  stories: StoryItems[];
  number: number;
  size: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetSpotBriefInfoRequest {
  longitude: number;
  latitude: number;
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

// getSpotListInMap
export interface GetSpotInMapRequest {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
}
export interface SpotsListInMap {
  storySpots: SpotsItemInMap[];
}

export interface SpotsItemInMap {
  longitude: number;
  latitude: number;
  storySpotId: number;
}

//공통
export interface StoryAuthor {
  storyAuthorId?: number;
  nickname?: string;
  profileUrl?: string;
}

//getStoryListInMap 게시글 리스트
export interface GetStoryInMapRequest {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
  page: number;
  size: number;
  sort: "createdAt,desc" | "createdAt,asc" | "likeCount,desc" | "likeCount,asc";
}

export interface StoryInMapResponse {
  stories?: StoryListItem[];
}

export interface StoryListItem {
  storyId: number;
  storyAuthor?: StoryAuthor;
  title?: string;
  content?: string;
  locale?: "KO" | "EN";
  storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  likeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrls?: string[];
}

//getSpotInfo 스팟 마커 리스트
export interface GetSpotRequest {
  storySpotId: number | undefined;
  query: {
    query: {
      longitude: number | undefined;
      latitude: number | undefined;
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

export interface SpotInfo {
  briefSpotInfo: BriefSpotInfo;
  spotTitleList: SpotTitleList;
  distance: number;
  storyItems: StoryItems[];
  summaries: StorySummary[];
}

export interface BriefSpotInfo {
  longitude?: number;
  latitude?: number;
  storySpotId?: number;
}

export interface SpotTitleList {
  titles?: string[];
}

export interface StoryItems {
  storyAuthor?: StoryAuthor;
  title?: string;
  content?: string;
  locale?: "KO" | "EN";
  storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  likeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrls?: string[];
}

export interface StorySummary {
  storySpotSummaryId?: number;
  storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
  docentUrl?: string;
  title?: string;
  summary?: string;
  summarizedStoryIdSet?: number[];
  updatedAt?: string;
}
