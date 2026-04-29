import { LatLng } from "react-native-maps/src/sharedTypes";

import { BaseResponse } from "@/types/auth";
import {
  GetLocationSpotBriefInfoResponse,
  GetSearchTitleRequest,
  GetSpotInMapRequest,
  GetSpotRequest,
  GetStoryInMapRequest,
  SearchSpotInfoResponse,
  SpotInfo,
  SpotsListInMap,
  StoryInMapResponse,
} from "@/types/storySpot";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "../axios";

//스팟 위치 정보 -> 이야기게시글 불러오기 (스팟 전체 정보 조회)
export const getSpotInfo = async (param: GetSpotRequest): Promise<SpotInfo> => {
  const { storySpotId, query } = param;

  try {
    const response = await api.get<BaseResponse<SpotInfo>>(
      `${API_ENDPOINTS.STORY.SPOT_INFO(storySpotId)}`,
      { params: { ...query.query } }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
//스팟 선택(storyId) -> 관련스팟 제목

//스팟 선택(위치정보) -> 관련 스팟 제목,id 가져오기 (좌표기반이야기 스팟 정보 조회)
export const getStorySpotInfoBrief = async (param: LatLng) => {
  try {
    const response = await api.get<
      BaseResponse<GetLocationSpotBriefInfoResponse>
    >(`${API_ENDPOINTS.STORY.SPOT_INFO_BRIEF}`, { params: param });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//지도 사각형 내 스팟 목록 조회(마커) story/spot/map
export const getSpotListInMap = async (param: GetSpotInMapRequest) => {
  try {
    const response = await api.get<BaseResponse<SpotsListInMap>>(
      `${API_ENDPOINTS.STORY.SPOT_LIST_IN_MAP}`,
      { params: param }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//지도 사각형 영역 내 이야기 게시글 조회 story/map
export const getStoryListInMap = async (param: GetStoryInMapRequest) => {
  try {
    const response = await api.get<BaseResponse<StoryInMapResponse>>(
      `${API_ENDPOINTS.STORY.STORY_LIST_IN_MAP}`,
      { params: param }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
