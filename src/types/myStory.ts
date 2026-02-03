export interface MyStoryItem {
    storyId: number;
    storyAuthor?: {
        storyAuthorId?: number;
        nickname?: string;
        profileUrl?: string;
    };
    title?: string;
    content?: string;
    storyConcept?: "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
    imageUrls?: string[];
    likeCount?: number;
    storySpotId?: number;
    latitude?: number;
    longitude?: number;
    createdAt?: number[] | string;
    updatedAt?: number[] | string;
    isLiked?: boolean;
}

export interface MyStoryListResponse {
    stories: MyStoryItem[];
    lastStoryId: number | null;
    hasNext: boolean;
}

export interface GetMyStoriesRequest {
    lastStoryId?: number;
    size?: number;
}

export interface ToggleLikeResponse {
    isLiked: boolean;
    likeCount: number;
}

export interface GetLikedStoriesRequest {
    lastStoryLikeId?: number;
    size?: number;
}