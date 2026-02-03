import { BaseResponse } from "@/types/auth";
import { GetLikedStoriesRequest, GetMyStoriesRequest, MyStoryListResponse, ToggleLikeResponse } from "@/types/myStory";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "../axios";

export const getMyStories = async (
    param: GetMyStoriesRequest
): Promise<MyStoryListResponse> => {
    try {
        const response = await api.get<BaseResponse<MyStoryListResponse>>(
            API_ENDPOINTS.STORY.MY_STORIES,
            { params: param }
        );
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const toggleStoryLike = async (
    storyId: number
): Promise<ToggleLikeResponse> => {
    try {

        const response = await api.post<BaseResponse<ToggleLikeResponse>>(
            API_ENDPOINTS.STORY.TOGGLE_LIKE(storyId)
        );

        return response.data.data;
    } catch (error) {
        console.error("toggleStoryLike 에러:", error);
        throw error;
    }
};

export const getLikedStories = async (
    param: GetLikedStoriesRequest
): Promise<MyStoryListResponse> => {
    try {
        const response = await api.get<BaseResponse<MyStoryListResponse>>(
            API_ENDPOINTS.STORY.LIKED_STORIES,
            { params: param }
        );
        return response.data.data;
    } catch (error) {
        throw error;
    }
};