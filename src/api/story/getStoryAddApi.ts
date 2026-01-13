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
    const createTextRes = await api.post<BaseResponse<CreateStoryResponse>>(
      `${API_ENDPOINTS.STORY.CREATE}`,
      param
    );

    const storyData = createTextRes.data.data;
    const storyId = storyData.storyId;

    if (images && images.length > 0) {
      const formData = new FormData();

      images.forEach((imageUri, index) => {
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        } as any);
      });

      await api.post<BaseResponse<void>>(
        `/api/user/story/image/${storyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }
    return createTextRes.data;
  } catch (error) {
    throw error;
  }
};
