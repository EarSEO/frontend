import { BaseResponse } from "@/types/auth";
import { GetRouteRequest, GetRouteResponse } from "@/types/route";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const getRouteApi = async (
  body: GetRouteRequest,
): Promise<GetRouteResponse> => {
  try {
    const response = await api.post<BaseResponse<GetRouteResponse>>(
      `${API_ENDPOINTS.ROUTE.CREATE_IN_PROGRESS_ROUTE}`,
      body,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export default getRouteApi;
