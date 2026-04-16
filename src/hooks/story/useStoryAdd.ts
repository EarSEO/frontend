import { useCallback, useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useGlobalSearchParams } from "expo-router";

import { CreateStoryRequest } from "@/types/storySpot";

import { getcreateStory } from "@/api/story/getStoryAddApi";
import { useAuthStore } from "@/store/profile/useAuthStore";
import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useBaseMapStore } from "@/store/useBaseMapStore";
import { useMapHeaderStore } from "@/store/useMapHeaderStore";

export type StoryConcept = "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
export const CONCEPTS = [
  { value: "TIP", label: "🍯꿀팁" },
  { value: "EXPERIENCE", label: "🗣️경험담" },
  { value: "CULTURE", label: "🎩문화" },
  { value: "HISTORY", label: "🏛️역사" },
  { value: "ETC", label: "👀기타" },
] as const;

export const useStoryAdd = () => {
  const { mapType } = useGlobalSearchParams();

  const { selectedSight } = useSightStore();

  const briefSpotInfo = useStoryStore((state) => state.briefSpotInfo);

  const { setStoryAddStep, setNewSpotName, setStoryLocation } =
    useStoryAddStore();
  const { setSearchedSpot } = useStoryStore();
  //핀 위치 위경도로 변경
  const { setCenterPinVisibility } = useBaseMapStore();
  const { setMapHeaderContent } = useMapHeaderStore();

  //검색한 장소 선택 시
  const searchedSpot = useStoryStore((state) => state.searchedSpot);

  //storyAdd
  const [content, setContent] = useState<string>("");
  const [selectedConcept, setSelectedConcept] = useState<StoryConcept | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const newSpotName = useStoryAddStore((state) => state.newSpotName);
  const markedLocation = useStoryAddStore((state) => state.markedLocation);

  //storyAdd 버튼 클릭 시
  const handleStoryAddButton = useCallback(() => {
    setCenterPinVisibility(true);
    setMapHeaderContent(undefined);

    if (
      briefSpotInfo?.longitude !== undefined &&
      briefSpotInfo?.latitude !== undefined
    ) {
      const spotLocation = {
        latitude: briefSpotInfo.latitude,
        longitude: briefSpotInfo.longitude,
      };
      setStoryLocation(spotLocation);
      setStoryAddStep("name");
    } else if (
      selectedSight?.latitude !== undefined &&
      selectedSight?.longitude !== undefined &&
      selectedSight.title
    ) {
      const sightLocation = {
        latitude: selectedSight.latitude,
        longitude: selectedSight.longitude,
      };
      setStoryLocation(sightLocation);
      setNewSpotName(selectedSight.title);
      setStoryAddStep("storyAdd");
    } else {
      setStoryAddStep("location");
    }
  }, [
    mapType,
    briefSpotInfo?.latitude,
    briefSpotInfo?.longitude,
    selectedSight,
    setStoryAddStep,
    setStoryLocation,
    setCenterPinVisibility,
    setMapHeaderContent,
  ]);

  //selectedSpot값(location에서 검색하고 선택 된 값) 있으면 조회해서 이름 띄워주기
  // 이경로에서 이름 입력하시겠습니까 클릭 시 ->  기존spot은 spotTitleList에서 title 조회, new는 state에서 값 조회
  const fetchAddSpotInfo = useCallback(async () => {
    if (searchedSpot) {
      const location = {
        latitude: searchedSpot.latitude,
        longitude: searchedSpot.longitude,
      };
      setStoryLocation(location);
      setNewSpotName(searchedSpot.title);
      setStoryAddStep("name");
      setSearchedSpot(undefined);
    } else if (!searchedSpot) {
      setStoryAddStep("name");
    }
  }, [searchedSpot, setStoryAddStep]);

  //새로운 이름 저장
  const handleNewSpotInfo = useCallback(() => {
    if (!newSpotName) {
      Alert.alert("스팟 이름을 입력해주세요.");
      return;
    } else {
      setStoryAddStep("storyAdd");
    }
  }, [setStoryAddStep, newSpotName]);

  //이미지
  const handlePickImage = useCallback(async () => {
    if (selectedImages.length >= 3) {
      Alert.alert("사진은 최대 3장까지 등록 가능합니다.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages([...selectedImages, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("오류", "이미지를 불러오는 중 문제가 발생했습니다.");
    }
  }, [selectedImages]);

  const handleRemoveImage = useCallback(
    (index: number) => {
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
    },
    [selectedImages]
  );

  //위치 다시 선택
  const handleMapButton = useCallback(() => {
    setStoryAddStep("location");
    setStoryLocation(undefined);
  }, [setStoryAddStep]);

  //스토리 추가
  const handleAdd = useCallback(async () => {
    if (!content || !newSpotName || !selectedConcept) {
      Alert.alert("모든 항목을 입력해주세요.");
      return;
    }

    const { user } = useAuthStore.getState();

    if (!user) {
      Alert.alert("(유저)정보를 불러오지못했습니다.");
      return;
    }
    if (!markedLocation) {
      Alert.alert("(위치)정보를 불러오지못했습니다.");
      return;
    }
    try {
      const createRequestData: CreateStoryRequest = {
        authorId: user.memberId,
        authorName: user.nickname,
        authorProfileUrl: user.profileUrl,
        authorProfileUpdatedAt: user.updatedAt.toISOString(),
        latitude: markedLocation.latitude,
        longitude: markedLocation.longitude,
        title: newSpotName,
        content: content,
        storyConcept: selectedConcept,
        locale: "KO",
      };
      await getcreateStory(createRequestData, selectedImages);
      setStoryAddStep("none");
      setCenterPinVisibility(false);
    } catch (error) {
      throw error;
    }
  }, [markedLocation, newSpotName, content, selectedConcept]);

  return {
    handleStoryAddButton,
    fetchAddSpotInfo,
    handleNewSpotInfo,

    markedLocation,
    setNewSpotName,
    setStoryLocation,

    setSearchedSpot,

    //create
    handleRemoveImage,
    handleAdd,
    handlePickImage,
    handleMapButton,
    selectedImages,
    selectedConcept,
    setSelectedConcept,
    content,
    setContent,
  };
};
