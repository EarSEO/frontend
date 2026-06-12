import { BaseResponse } from "@/types/auth";
import {  SearchSightList, SearchSightParams } from "@/types/sight";
import {
  GetSearchTitleRequest,
  SearchSpotInfoResponse,
} from "@/types/storySpot";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

// 관광지 검색
export const getSearchSight = async (params: SearchSightParams) => {
  const response = await api.get<BaseResponse<SearchSightList>>(
    API_ENDPOINTS.SIGHT.SEARCH,
    { params }
  );
  return response.data.data;
};
  
//이야기 이름으로 검색
export const getSearchStory = async (params: GetSearchTitleRequest) => {
  try {
    const response = await api.get<BaseResponse<SearchSpotInfoResponse>>(
      `${API_ENDPOINTS.STORY.SEARCH}`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
