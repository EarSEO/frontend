import { create } from "zustand";

import { BookmarkInfo, BookmarkInfoList } from "@/types/bookmark";

interface BookmarkState {
  userBookmarkList: BookmarkInfoList | undefined;

  setUserBookmarkList: (list: BookmarkInfoList) => void;
  setAddBookmark: (bookmark: BookmarkInfo) => void;
  setRemoveBookmark: (bookmark: BookmarkInfo) => void;
  resetUserBookmarkList: () => void;
}

const initialState = {
  userBookmarkList: undefined,
};

export const useBookmarkStore = create<BookmarkState>((set) => ({
  ...initialState,

  //로그인 시 북마크 전체 조회
  setUserBookmarkList: (list) => set({ userBookmarkList: list }),

  //북마크 추가 시 store에 리스트 업데이트
  setAddBookmark: (bookmark) =>
    set((state) => {
      const current = state.userBookmarkList?.bookmarks ?? [];

      const exists = current.some((b) => b.sightId === bookmark.sightId);
      if (exists) return state;

      return {
        userBookmarkList: {
          bookmarks: [bookmark, ...current],
        },
      };
    }),

  //북마크 삭제 시 store에 리스트 업데이트
  setRemoveBookmark: (bookmark) =>
    set((state) => {
      const current = state.userBookmarkList?.bookmarks ?? [];

      return {
        userBookmarkList: {
          bookmarks: current.filter((b) => b.sightId !== bookmark.sightId),
        },
      };
    }),

  //로그아웃 시 북마크 삭제
  resetUserBookmarkList: () => set(initialState),
}));
