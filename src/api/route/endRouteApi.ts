import { BaseResponse } from "@/types/auth";
import { GetRouteResponse } from "@/types/route";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const getRouteApi = async (routeId: number): Promise<void> => {
  try {
    await api.post<BaseResponse<GetRouteResponse>>(
      `${API_ENDPOINTS.ROUTE.COMPLETE_ROUTE(routeId)}`,
    );
    return;
  } catch (error) {
    throw error;
  }
};

export default getRouteApi;
