import axios from "axios";

import { BaseResponse } from "@/types/auth";
import {
  GetMapStoriesRequest,
  GetMapStoryResponse,
  GetSpotTotalInfoResponse,
  GetStoryRequest,
} from "@/types/storySpot";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "./axios";

export const getStoryApi = async (
  param: GetStoryRequest
): Promise<GetSpotTotalInfoResponse> => {
  const { storySpotId, query } = param;

  try {
    const response = await api.get<BaseResponse<GetSpotTotalInfoResponse>>(
      `${API_ENDPOINTS.STORY.SPOTTOTALINFO(storySpotId)}`,
      { params: { ...query.query } }
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
      { params: param }
    );
    return response.data.data;
  } catch (error) {
    console.log("연결안됨");
    throw error;
  }
};
