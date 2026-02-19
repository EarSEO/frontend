import { useCallback } from "react";

import {
  getAddBookmark,
  getBookmarkInfo,
  getDeleteBookmark,
} from "@/api/sight/getSightBookMark";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";

export const useBookmark = () => {
  const { setUserBookmarkList, setAddBookmark, setRemoveBookmark } =
    useBookmarkStore();

  const { user } = useAuthStore();

  const memberId = user?.memberId;

  //북마크 조회
  const fetchBookmark = useCallback(async () => {
    try {
      const res = await getBookmarkInfo({ userId: memberId });
      setUserBookmarkList(res);
    } catch (error) {
      throw error;
    }
  }, [user, setUserBookmarkList]);

  //북마크 추가
  const insertBookmark = useCallback(
    async (sightId: string) => {
      if (!memberId) return;
      const bookMark = {
        sightId: sightId,
        memberId: memberId,
      };
      setAddBookmark(bookMark);
      try {
        await getAddBookmark(sightId, memberId);
      } catch (error) {
        throw error;
      }
    },
    [memberId, setUserBookmarkList, setAddBookmark]
  );

  //북마크 삭제
  const removeBookmark = useCallback(
    async (sightId: string) => {
      if (!memberId) return;
      const bookMark = {
        sightId: sightId,
        memberId: memberId,
      };
      setRemoveBookmark(bookMark);

      try {
        await getDeleteBookmark(sightId, memberId);
      } catch (error) {
        throw error;
      }
    },
    [memberId, setUserBookmarkList, setRemoveBookmark]
  );

  return {
    fetchBookmark,
    insertBookmark,
    removeBookmark,
  };
};
