export interface BookmarkEditRequest {
  id: number;
  sightId: number;
}

export interface BookmarkEditResponse {
  isLiked: boolean;
  sightId: number;
}

export interface BookmarkInfoRequest {
  userId?: number;
}

export interface BookmarkInfoList {
  bookmarks: BookmarkInfo[];
}

export interface BookmarkInfo {
  sightId: number;
  memberId: number;
}
