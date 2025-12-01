import { BaseResponse } from "@/types/auth";
import { SearchSightParams, SightInfo, SightMapInfoList } from "@/types/sight";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

// 관광지 검색
export const getSearchSight = async (
  params: SearchSightParams,
): Promise<SightInfo[]> => {
  const response = await api.get<BaseResponse<SightMapInfoList>>(
    API_ENDPOINTS.SIGHT.SEARCH,
    { params },
  );
  return response.data.data.sights;
};
