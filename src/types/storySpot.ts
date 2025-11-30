export interface GetSpotTotalInfoResponse {
  briefSpotInfo?: SpotInfoResponse;
  spotTitleList?: SpotTitleListResponse;
  distance?: number;
  stories?: StoryInfoResponse[];
  summaries?: StorySummaryResponse[];
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
  storyAuthorId?: number;
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
