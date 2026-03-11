export interface BookmarkEditRequest {
  id: number;
  sightId: string;
}

export interface BookmarkEditResponse {
  isLiked: boolean;
  sightId: string;
}

export interface BookmarkInfoRequest {
  userId?: number;
}

export interface BookmarkInfoList {
  bookmarks: BookmarkInfo[];
}

export interface BookmarkInfo {
  sightId: string;
  memberId: number;
}
