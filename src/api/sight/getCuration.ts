import { BaseResponse } from "@/types/auth";
import { CurationItem, CurationListResponse } from "@/types/sight";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

export const getCurationList = async (): Promise<CurationItem[]> => {
  const res = await api.get<BaseResponse<CurationListResponse>>(
    API_ENDPOINTS.SIGHT.CURATION,
  );
  return res.data.data.curationList;
};
