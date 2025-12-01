import { BaseResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const getSightScriptApi = async (
  sightDocentContentId: number,
): Promise<DocentScript> => {
  try {
    const response = await api.get<BaseResponse<DocentScript>>(
      `${API_ENDPOINTS.SIGHT.DOCENT_SCRIPT}`,
      { params: { sightId: sightDocentContentId } },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

interface DocentScript {
  docentUrl: string;
  script: string;
}

export default getSightScriptApi;
