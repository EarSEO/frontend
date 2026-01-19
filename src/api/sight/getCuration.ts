import { BaseResponse } from "@/types/auth";
import {
  CurationItem,
  CurationListResponse,
  CurationSightListParam,
  CurationSightListResponse,
} from "@/types/sight";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

//큐레이션 리스트 조회
export const getCurationList = async (): Promise<CurationItem[]> => {
  const res = await api.get<BaseResponse<CurationListResponse>>(
    API_ENDPOINTS.SIGHT.CURATION.CURATION
  );
  return res.data.data.curationList;
};

//큐레이션_관광지 리스트 조회
export const getCurationSightList = async (
  params: CurationSightListParam
): Promise<CurationSightListResponse | undefined> => {
  const { curationId, longitude, latitude } = params;
  try {
    const res = await api.get<BaseResponse<CurationSightListResponse>>(
      `${API_ENDPOINTS.SIGHT.CURATION.SIGHT_LIST(curationId)}`,
      { params: { longitude, latitude } }
    );
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
