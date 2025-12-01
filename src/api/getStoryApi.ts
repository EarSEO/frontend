import axios from "axios";

import { BaseResponse } from "@/types/auth";
import {
  CreateStoryRequest,
  CreateStoryResponse,
  GetLocationSpotBriefInfoResponse,
  GetMapStoriesRequest,
  GetMapStoryResponse,
  GetSearchTitleRequest,
  GetSpotBriefInfoRequest,
  GetSpotTotalInfoResponse,
  GetStoryRequest,
  SearchSpotInfoResponse,
} from "@/types/storySpot";

import API_ENDPOINTS from "@/constants/endpoints";

import { useAuthStore } from "@/store/useAuthStore";

import api from "./axios";

export const getStoryApi = async (
  param: GetStoryRequest,
): Promise<GetSpotTotalInfoResponse> => {
  const { storySpotId, query } = param;

  try {
    const response = await api.get<BaseResponse<GetSpotTotalInfoResponse>>(
      `${API_ENDPOINTS.STORY.SPOTTOTALINFO(storySpotId)}`,
      { params: { ...query.query } },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//지도 사각형 영역 내 이야기 스팟 조회
export const getRectangle = async (param: GetMapStoriesRequest) => {
  try {
    const response = await api.get<BaseResponse<GetMapStoryResponse>>(
      `${API_ENDPOINTS.STORY.MAP_RECTANGLE}`,
      { params: param },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//
export const getSpotBriefInfo = async (param: GetSpotBriefInfoRequest) => {
  try {
    const response = await api.get<
      BaseResponse<GetLocationSpotBriefInfoResponse>
    >(`${API_ENDPOINTS.STORY.SPOT_BRIEF_INFO}`, { params: param });
    return response.data.data;
  } catch (error) {
    console.log("연결안됨");
    throw error;
  }
};

export const createStoryTextApi = async (
  param: CreateStoryRequest,
  images?: string[],
) => {
  try {
    const { user } = useAuthStore.getState();

    const createTextRes = await api.post<BaseResponse<CreateStoryResponse>>(
      `${API_ENDPOINTS.STORY.CREATE_STRORY}`,
      param,
    );

    console.log("1차 텍스트 연결 성공");

    const storyData = createTextRes.data.data;
    const storyId = storyData.storyId;

    if (images && images.length > 0) {
      const formData = new FormData();

      images.forEach((imageUri, index) => {
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        } as any);
      });

      await api.post<BaseResponse<void>>(
        `/api/user/story/image/${storyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    }

    return createTextRes.data;
  } catch (error) {
    console.log("createStoryApi error: ", error);
    throw error;
  }
};

export const getSearchTitle = async (param: GetSearchTitleRequest) => {
  try {
    const response = await api.get<BaseResponse<SearchSpotInfoResponse>>(
      `${API_ENDPOINTS.STORY.SEARCH_TITLE}`,
      { params: param },
    );
    return response.data.data;
  } catch (error) {
    console.log("연결안됨");
    throw error;
  }
};
