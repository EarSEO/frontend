import axios from "axios";

import { BaseResponse } from "@/types/auth";
import { GetSpotTotalInfoResponse, GetStoryRequest } from "@/types/storySpot";

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
