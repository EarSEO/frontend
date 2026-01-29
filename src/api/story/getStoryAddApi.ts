import { BaseResponse } from "@/types/auth";
import { CreateStoryRequest, CreateStoryResponse } from "@/types/storySpot";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "../axios";

//이야기 등록
export const getcreateStory = async (
  param: CreateStoryRequest,
  images?: string[]
) => {
  try {
    const formData = new FormData();
    formData.append("body", JSON.stringify(param));

    if (images && images.length > 0) {
      images.forEach((imageUri, index) => {
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        } as any);
      });
    }

    const response = await api.post<BaseResponse<CreateStoryResponse>>(
      `${API_ENDPOINTS.STORY.CREATE}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};