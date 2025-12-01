import * as SecureStore from "expo-secure-store";

import { BaseResponse } from "@/types/auth";
import { GetRouteResponse } from "@/types/route";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";
import { ACCESS_TOKEN } from "@/store/secureStoreKey";

const getRouteApi = async (routeId: number): Promise<void> => {
  try {
    const accessToken = SecureStore.getItem(ACCESS_TOKEN);
    await api.post<BaseResponse<GetRouteResponse>>(
      `${API_ENDPOINTS.ROUTE.COMPLETE_ROUTE(routeId)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return;
  } catch (error) {
    throw error;
  }
};

export default getRouteApi;
