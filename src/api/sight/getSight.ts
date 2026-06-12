import { BaseResponse } from "@/types/auth";
import {
  CircleBoundsParams,
  RectangleBoundsParams,
  SightDetailInfo,
  SightDetailParams,
  SightInfo,
  SightMapInfoList,
} from "@/types/sight";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "../axios";

// 사각형 영역 내 관광지 목록 조회
export const getSightsInRectangle = async (
  params: RectangleBoundsParams
): Promise<SightInfo[]> => {
  const response = await api.get<BaseResponse<SightMapInfoList>>(
    API_ENDPOINTS.SIGHT.RECTANGLE,
    { params }
  );
  return response.data.data.sights;
};

// 관광지 상세 정보 조회
export const getSightDetail = async (
  params: SightDetailParams
): Promise<SightDetailInfo> => {
  const response = await api.get<BaseResponse<SightDetailInfo>>(
    API_ENDPOINTS.SIGHT.DETAIL,
    { params }
  );
  return response.data.data;
};
