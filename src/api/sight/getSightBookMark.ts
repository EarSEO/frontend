import { BaseResponse, User } from "@/types/auth";
import {
  BookmarkEditResponse,
  BookmarkInfoList,
  BookmarkInfoRequest,
} from "@/types/bookmark";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "../axios";

//북마크 추가
export const getAddBookmark = async (
  sightId: string,
  userId: number
): Promise<BookmarkEditResponse> => {
  try {
    const response = await api.post<BaseResponse<BookmarkEditResponse>>(
      API_ENDPOINTS.SIGHT.BOOKMARK.ADD(sightId),
      {}
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//북마크 삭제
export const getDeleteBookmark = async (
  sightId: string,
  userId: number
): Promise<BookmarkEditResponse> => {
  try {
    const response = await api.delete<BaseResponse<BookmarkEditResponse>>(
      API_ENDPOINTS.SIGHT.BOOKMARK.DELETE(sightId),
      {}
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//북마크 리스트 보기
export const getBookmarkInfo = async (
  param: BookmarkInfoRequest | undefined
) => {
  try {
    const response = await api.get<BaseResponse<BookmarkInfoList>>(
      `${API_ENDPOINTS.SIGHT.BOOKMARK.GET_BOOKMARK}`,
      { params: param }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
