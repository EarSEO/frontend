import * as SecureStore from "expo-secure-store";

import { BaseResponse } from "@/types/auth";
import { GetRouteRequest, GetRouteResponse } from "@/types/route";

import API_ENDPOINTS from "@/constants/endpoints";

import api from "@/api/axios";
import { ACCESS_TOKEN } from "@/store/secureStoreKey";

const imageExample =
  "https://avatars.githubusercontent.com/u/58386334?v=4&s=1600";
const mp3Example =
  "https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3";

const getRouteApi = async (
  body: GetRouteRequest,
): Promise<GetRouteResponse> => {
  //TODO 더미 제거
  return {
    routeId: 12,
    path: [
      { longitude: 126.9768, latitude: 37.5759 },
      { longitude: 126.977, latitude: 37.576 },
      { longitude: 126.9775, latitude: 37.5762 },
      { longitude: 126.978, latitude: 37.5765 },
      { longitude: 126.9785, latitude: 37.575 },
      { longitude: 126.98, latitude: 37.573 },
      { longitude: 126.985, latitude: 37.571 },
      { longitude: 126.99, latitude: 37.569 },
      { longitude: 126.995, latitude: 37.568 },
      { longitude: 127.0, latitude: 37.5675 },
      { longitude: 127.005, latitude: 37.567 },
      { longitude: 127.0094, latitude: 37.5669 },
    ],
    routeItems: [
      {
        itemType: "STORY_SPOT",
        itemId: 1,
        itemName: "경복궁 주차장",
        itemDocentUrl: mp3Example,
        point: {
          longitude: 126.9771,
          latitude: 37.5798,
        },
        itemTheme: undefined,
        itemImageUrl: undefined,
        itemAddress: undefined,
        summaryId: 1,
      },
      {
        itemType: "SIGHT",
        itemId: 4,
        itemName: "경복궁",
        itemImageUrl: imageExample,
        itemAddress: "서울 종로구",
        point: {
          longitude: 126.9768,
          latitude: 37.5759,
        },
        itemDocentUrl: mp3Example,
        itemTheme: "역사",
        summaryId: undefined,
      },
      {
        itemType: "STORY_SPOT",
        itemId: 37,
        itemName: "남한산성 카페",
        itemImageUrl: undefined,
        itemAddress: undefined,
        point: {
          longitude: 127.1811,
          latitude: 37.4789,
        },
        itemDocentUrl: mp3Example,
        itemTheme: undefined,
        summaryId: 5,
      },
      {
        itemType: "SIGHT",
        itemId: 1,
        itemName: "동대문 디자인 플라자",
        itemImageUrl: imageExample,
        itemAddress: "서울 중구",
        point: {
          longitude: 127.0094,
          latitude: 37.5669,
        },
        itemDocentUrl: mp3Example,
        itemTheme: "쇼핑",
        summaryId: undefined,
      },
    ],
  };
  try {
    const accessToken = SecureStore.getItem(ACCESS_TOKEN);
    const response = await api.post<BaseResponse<GetRouteResponse>>(
      `${API_ENDPOINTS.SIGHT.DOCENT_SCRIPT}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export default getRouteApi;
