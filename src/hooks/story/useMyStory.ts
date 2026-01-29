import { create } from "zustand";

import { GetMyStoriesRequest, MyStoryItem, ToggleLikeResponse } from "@/types/myStory";

import { getMyStories, toggleStoryLike } from "@/api/story/getMyStoryApi";

import { useLikedStory } from "./useLikedStory";

type MyStoryState = {
    myStories: MyStoryItem[];
    lastStoryId: number | null;
    hasNext: boolean;
    isLoading: boolean;

    fetchMyStories: (isRefresh?: boolean) => Promise<void>;
    toggleLike: (storyId: number) => Promise<void>;
};

export const useMyStory = create<MyStoryState>((set, get) => ({
    myStories: [],
    lastStoryId: null,
    hasNext: false,
    isLoading: false,

    fetchMyStories: async (isRefresh = false) => {
        const { isLoading, lastStoryId } = get();
        if (isLoading) return;

        set({ isLoading: true });
        try {
            const param: GetMyStoriesRequest = {
                size: 10,
                lastStoryId: isRefresh ? undefined : lastStoryId ?? undefined,
            };

            const response = await getMyStories(param);

            const incoming: MyStoryItem[] = response.stories.map((story: MyStoryItem) => ({
                ...story,
                createdAt: formatDateArray(story.createdAt),
                isLiked: story.isLiked ?? false,
            }));

            set((s) => {
                const merged = incoming.map((p) => {
                    const local = s.myStories.find((x) => x.storyId === p.storyId);
                    if (!local) return p;

                    return {
                        ...p,
                        isLiked: typeof local.isLiked === "boolean" ? local.isLiked : p.isLiked,
                        likeCount: typeof local.likeCount === "number" ? local.likeCount : p.likeCount,
                    };
                });

                return {
                    myStories: isRefresh ? merged : [...s.myStories, ...merged],
                    lastStoryId: response.lastStoryId,
                    hasNext: response.hasNext,
                };
            });
        } catch (e) {
            console.error("내 이야기 조회 실패:", e);
        } finally {
            set({ isLoading: false });
        }
    },
    toggleLike: async (storyId: number) => {
        const current = get().myStories.find((s) => s.storyId === storyId);
        if (!current) return;

        const prevIsLiked = !!current.isLiked;
        const prevCount = current.likeCount ?? 0;

        const nextIsLiked = !prevIsLiked;
        const nextCount = prevIsLiked ? Math.max(0, prevCount - 1) : prevCount + 1;

        set((s) => ({
            myStories: s.myStories.map((st) =>
                st.storyId === storyId ? { ...st, isLiked: nextIsLiked, likeCount: nextCount } : st
            ),
        }));

        useLikedStory.getState().syncLikeState(storyId, nextIsLiked, nextCount);

        try {
            const res = (await toggleStoryLike(storyId)) as ToggleLikeResponse;

            set((s) => ({
                myStories: s.myStories.map((st) =>
                    st.storyId === storyId
                        ? { ...st, isLiked: res.isLiked, likeCount: res.likeCount }
                        : st
                ),
            }));
            useLikedStory.getState().syncLikeState(storyId, res.isLiked, res.likeCount);
        } catch (e) {
            set((s) => ({
                myStories: s.myStories.map((st) =>
                    st.storyId === storyId ? { ...st, isLiked: prevIsLiked, likeCount: prevCount } : st
                ),
            }));
            useLikedStory.getState().syncLikeState(storyId, prevIsLiked, prevCount);
            console.error("좋아요 토글 실패:", e);
        }
    },
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
    if (typeof dateArray === "string") return dateArray;
    if (!dateArray || !Array.isArray(dateArray)) return "";

    const [year, month, day, hour, minute] = dateArray;
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}