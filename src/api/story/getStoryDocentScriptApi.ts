import { BaseResponse } from "@/types/auth";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";

const getStoryScriptApi = async (summaryId: number): Promise<DocentScript> => {
  try {
    const response = await api.get<BaseResponse<DocentScript>>(
      `${API_ENDPOINTS.STORY.DOCENT_SCRIPT}`,
      { params: { summaryId: summaryId } },
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

export default getStoryScriptApi;
