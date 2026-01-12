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
  MapSpotInfoList,
  SearchSpotInfoResponse,
  StoryEditRequest,
  StoryEditResponse,
} from "@/types/storySpot";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "./axios";

//스팟 위치 정보 -> 이야기게시글 불러오기
export const getStoryInfo = async (
  param: GetStoryRequest
): Promise<GetSpotTotalInfoResponse> => {
  const { storySpotId, query } = param;

  try {
    const response = await api.get<BaseResponse<GetSpotTotalInfoResponse>>(
      `${API_ENDPOINTS.STORY.SPOT_INFO(storySpotId)}`,
      { params: { ...query.query } }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
//스팟 선택(storyId) -> 관련스팟 제목

//스팟 선택(위치정보) -> 관련 스팟 제목,id 가져오기
export const getStorySpotBriefInfo = async (param: GetSpotBriefInfoRequest) => {
  try {
    const response = await api.get<
      BaseResponse<GetLocationSpotBriefInfoResponse>
    >(`${API_ENDPOINTS.STORY.SPOT_BRIEF_INFO}`, { params: param });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//이야기 이름으로 검색
export const getSearchStory = async (param: GetSearchTitleRequest) => {
  try {
    const response = await api.get<BaseResponse<SearchSpotInfoResponse>>(
      `${API_ENDPOINTS.STORY.SEARCH}`,
      {
        params: param,
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//지도 사각형 내 스토리 스팟 목록 조회
export const getStorySpotListInMap = async (param: GetMapStoriesRequest) => {
  try {
    const response = await api.get<BaseResponse<MapSpotInfoList>>(
      `${API_ENDPOINTS.STORY.SPOT_LIST_IN_MAP}`,
      { params: param }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//지도 사각형 영역 내 이야기 게시글 조회
export const getStoryListInMap = async (param: GetMapStoriesRequest) => {
  try {
    const response = await api.get<BaseResponse<GetMapStoryResponse>>(
      `${API_ENDPOINTS.STORY.STORY_LIST_IN_MAP}`,
      { params: param }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

