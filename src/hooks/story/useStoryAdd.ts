import { useCallback, useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { CreateStoryRequest } from "@/types/storySpot";

import { getcreateStory } from "@/api/story/getStoryAddApi";
import { useAuthStore } from "@/store/profile/useAuthStore";
import { useSightStore } from "@/store/sight/useSightStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

export type StoryConcept = "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";
export const CONCEPTS = [
  { value: "TIP", label: "🍯꿀팁" },
  { value: "EXPERIENCE", label: "🗣️경험담" },
  { value: "CULTURE", label: "🎩문화" },
  { value: "HISTORY", label: "🏛️역사" },
  { value: "ETC", label: "👀기타" },
] as const;

export const useStoryAdd = () => {
  const { selectedSight } = useSightStore();

  const briefSpotInfo = useStoryStore((state) => state.briefSpotInfo);

  const { setStoryAddStep, setNewSpotName, setStoryLocation } =
    useStoryAddStore();
  const pinAddress = useStoryAddStore((state) => state.pinAddress?.name);
  const { setSearchedSpot, setTitleList } = useStoryStore();
  //핀 위치 위경도로 변경

  //storyAdd
  const [content, setContent] = useState<string>("");
  const [selectedConcept, setSelectedConcept] = useState<StoryConcept | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const newSpotName = useStoryAddStore((state) => state.newSpotName);
  const addStoryLocation = useStoryAddStore((state) => state.addStoryLocation);
  const spotTitleList = useStoryStore((state) => state.spotTitleList);

  //storyAdd 버튼 클릭 시
  const handleStoryAddButton = useCallback(() => {
    if (
      briefSpotInfo?.longitude !== undefined &&
      briefSpotInfo?.latitude !== undefined &&
      spotTitleList?.titles
    ) {
      const spotLocation = {
        latitude: briefSpotInfo.latitude,
        longitude: briefSpotInfo.longitude,
      };
      setStoryLocation(spotLocation);
      setNewSpotName(spotTitleList.titles[0]);
      setStoryAddStep("storyAdd");
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
    briefSpotInfo?.latitude,
    briefSpotInfo?.longitude,
    selectedSight,
    setStoryAddStep,
    setStoryLocation,
    setNewSpotName,
    spotTitleList,
  ]);

  const fetchAddSpotInfo = useCallback(async () => {
    if (!pinAddress) {
      Alert.alert("지도를 움직여 위치를 지정해주세요.");
      return;
    }
    setTitleList(undefined);
    setStoryAddStep("storyAdd");
    setNewSpotName(undefined);
  }, [setStoryAddStep, pinAddress, setTitleList, setNewSpotName]);

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

  //스토리 추가 버튼 클릭
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
    if (!addStoryLocation) {
      Alert.alert("(위치)정보를 불러오지못했습니다.");
      return;
    }
    try {
      const createRequestData: CreateStoryRequest = {
        authorId: user.memberId,
        authorName: user.nickname,
        authorProfileUrl: user.profileUrl,
        authorProfileUpdatedAt: user.updatedAt.toISOString(),
        latitude: addStoryLocation.latitude,
        longitude: addStoryLocation.longitude,
        title: newSpotName,
        content: content,
        storyConcept: selectedConcept,
        locale: "KO",
      };
      await getcreateStory(createRequestData, selectedImages);

      setStoryAddStep("none");
    } catch (error) {
      throw error;
    }
  }, [addStoryLocation, newSpotName, content, selectedConcept]);

  return {
    handleStoryAddButton,
    fetchAddSpotInfo,

    addStoryLocation,
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
