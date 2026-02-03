import { create } from "zustand";

import { GetLikedStoriesRequest, MyStoryItem } from "@/types/myStory";

import { getLikedStories } from "@/api/story/getMyStoryApi";

type LikedStoryState = {
    likedStories: MyStoryItem[];
    lastStoryLikeId: number | null;
    hasNext: boolean;
    isLoading: boolean;

    fetchLikedStories: (isRefresh?: boolean) => Promise<void>;
    refreshLikedStories: () => void;
    syncLikeState: (storyId: number, isLiked: boolean, likeCount: number) => void;
};

export const useLikedStory = create<LikedStoryState>((set, get) => ({
    likedStories: [],
    lastStoryLikeId: null,
    hasNext: false,
    isLoading: false,

    fetchLikedStories: async (isRefresh = false) => {
        const { isLoading, lastStoryLikeId } = get();
        if (isLoading) return;

        set({ isLoading: true });
        try {
            const param: GetLikedStoriesRequest = {
                size: 10,
                lastStoryLikeId: isRefresh ? undefined : lastStoryLikeId ?? undefined,
            };

            const response = await getLikedStories(param);

            const formattedStories = response.stories.map((story) => ({
                ...story,
                createdAt: formatDateArray(story.createdAt),
                isLiked: true,
            }));

            set((s) => ({
                likedStories: isRefresh ? formattedStories : [...s.likedStories, ...formattedStories],
                lastStoryLikeId: response.lastStoryId,
                hasNext: response.hasNext,
            }));
        } catch (error) {
            console.error("좋아요한 글 조회 실패:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    refreshLikedStories: () => {
        set({ lastStoryLikeId: null });
        get().fetchLikedStories(true);
    },

    syncLikeState: (storyId: number, isLiked: boolean, likeCount: number) => {
        set((s) => ({
            likedStories: s.likedStories.map((st) =>
                st.storyId === storyId ? { ...st, isLiked, likeCount } : st
            ),
        }));
    },
}));

function formatDateArray(dateArray: number[] | string | undefined): string {
    if (typeof dateArray === "string") return dateArray;
    if (!dateArray || !Array.isArray(dateArray)) return "";

    const [year, month, day, hour, minute] = dateArray;
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}