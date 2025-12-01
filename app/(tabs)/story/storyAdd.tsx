import { useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Bluetooth, ChevronRight, MapPin, X } from "lucide-react-native";
import styled from "styled-components/native";

import Button from "@/components/common/Button";
import CloseButton from "@/components/common/CloseButton";
import Input from "@/components/common/Input";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/useAuthStore";
import { useStoryStore } from "@/store/useStoryStore";
import { useRouteStore } from "@/store/useRouteStore";
import { CreateStoryRequest } from "@/types/storySpot";
import { createStoryTextApi } from "@/api/getStoryApi";

type StoryConcept = "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";

const CONCEPTS = [
  { value: "TIP", label: "🍯꿀팁" },
  { value: "EXPERIENCE", label: "🗣️경험담" },
  { value: "CULTURE", label: "🎩문화" },
  { value: "HISTORY", label: "🏛️역사" },
  { value: "ETC", label: "👀기타" },
] as const;

export default function StoryAdd() {
  const [content, setContent] = useState<string>("");
  const [selectedConcept, setSelectedConcept] = useState<StoryConcept | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { newSpotName } = useStoryStore();
  const router = useRouter();

  const handleMapButton = () => {
    router.push("/story/spotLocationSelected");
  };

  const handlePickImage = async () => {
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
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!content || !newSpotName || !selectedConcept) {
      Alert.alert("하나라도 빠지면 안해주지롱");
      return;
    }

    const { user } = useAuthStore.getState();
    const { storyLocation } = useStoryStore.getState();

    if (!user || !storyLocation) {
      Alert.alert("정보를 불러오지못했습니다.");
      return;
    }

    try {
      const createRequestData: CreateStoryRequest = {
        authorId: user.memberId,
        authorName: user.nickname,
        authorProfileUrl: user.profileUrl,
        authorProfileUpdatedAt: user.updatedAt.toISOString(),
        latitude: storyLocation.latitude,
        longitude: storyLocation.longitude,
        title: newSpotName,
        content: content,
        storyConcept: selectedConcept,
        locale: "KO",
      };

      await createStoryTextApi(createRequestData, selectedImages);
      router.push("/story");
    } catch (error) {
      throw error;
    }
  };

  // const handleAdd = async () => {
  //   // 1) 기본 검증 (내용, 스팟 이름, 컨셉)
  //   if (!content || !newSpotName || !selectedConcept) {
  //     Alert.alert("하나라도 빠지면 안해주지롱");
  //     return;
  //   }

  //   // 2) 더미 유저 데이터 (store 대신 사용)
  //   const dummyUser = {
  //     memberId: 10, // 백엔드에서 허용하는 아무 숫자
  //     nickname: "이어동",
  //     profileUrl: "string", // 임시 이미지 URL
  //     updatedAt: "2025-12-01T13:42:18.385Z", // ISO 문자열 형태의 시간
  //   };

  //   // 3) 더미 위치 데이터 (스토리 위치)
  //   const dummyLocation = {
  //     latitude: 37.5665, // 서울 광화문 근처
  //     longitude: 126.978,
  //   };

  //   try {
  //     // 4) 실제 API에 보낼 요청 바디
  //     const createRequestData: CreateStoryRequest = {
  //       authorId: dummyUser.memberId,
  //       authorName: dummyUser.nickname,
  //       authorProfileUrl: dummyUser.profileUrl,
  //       authorProfileUpdatedAt: dummyUser.updatedAt, // 이미 string
  //       latitude: dummyLocation.latitude,
  //       longitude: dummyLocation.longitude,
  //       title: newSpotName, // 이건 여전히 store에서 온 값 사용
  //       content: content,
  //       storyConcept: selectedConcept,
  //       locale: "KO",
  //     };

  //     console.log("📤 요청 보낼 데이터:", createRequestData);

  //     await createStoryApi(createRequestData);
  //     Alert.alert("등록 완료!");
  //     router.push("/story");
  //   } catch (error) {
  //     console.error("스토리 생성 실패:", error);
  //     Alert.alert("에러", "스토리 등록 중 오류가 발생했습니다.");
  //   }
  // };

  return (
    <Container>
      <ScrollContainer>
        <Header>
          <CloseButton buttonStyle="NONE" onPress={"/story"} />
        </Header>

        <StoryAddContainer>
          <TitleWrapper>
            <Title>Add Stroy</Title>
          </TitleWrapper>

          <MapButtonWrapper onPress={handleMapButton}>
            <MapText>
              <MapPin size={24} />
              <LocationText>{newSpotName}</LocationText>
            </MapText>
            <ChevronRight size={20} />
          </MapButtonWrapper>

          <StoryConceptWrapper>
            {CONCEPTS.map((concept) => (
              <ConceptButton
                key={concept.value}
                selected={selectedConcept === concept.value}
                onPress={() =>
                  setSelectedConcept(concept.value as StoryConcept)
                }
              >
                <ButtonText selected={selectedConcept === concept.value}>
                  {concept.label}
                </ButtonText>
              </ConceptButton>
            ))}
          </StoryConceptWrapper>

          <InputWrapper>
            <Input
              value={content}
              onChangeText={setContent}
              width={340}
              height={200}
              radius={20}
              fontSize={16}
              multiline={true}
              placeholder="여러분의 이야기를 남겨보세요."
            />
          </InputWrapper>

          <ImageAddWrapper>
            <ImageListContainer>
              {selectedImages.map((imageUri, index) => (
                <ImageContainer key={index}>
                  <SelectedImage source={{ uri: imageUri }} />
                  <RemoveButton onPress={() => handleRemoveImage(index)}>
                    <X size={20} color="#fff" />
                  </RemoveButton>
                </ImageContainer>
              ))}

              {selectedImages.length < 3 && (
                <AddImageButton onPress={handlePickImage}>
                  <AddImageText>+</AddImageText>
                  <AddImageSubText>{selectedImages.length}/3</AddImageSubText>
                </AddImageButton>
              )}
            </ImageListContainer>
          </ImageAddWrapper>
        </StoryAddContainer>
      </ScrollContainer>

      <ButtonWrapper>
        <Button
          text="등록"
          onPress={handleAdd}
          width="90%"
          fontSize={theme.typography.fontSize.md}
        />
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  gap: 10px;
  background-color: ${theme.colors.background.background300};
`;
const ScrollContainer = styled.ScrollView`
  flex: 1;
`;
const Header = styled.View`
  padding: 16px;
  align-items: flex-end;
`;

const StoryAddContainer = styled.View`
  width: 340px;
  align-self: center;
  gap: 10px;
`;

const TitleWrapper = styled.View`
  margin-bottom: 10px;
  margin-left: 5px;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.xxl}px;
  color: ${theme.colors.text.textPrimary};
`;

const StoryConceptWrapper = styled.View`
  flex-direction: row;
  align-self: center;

  gap: 5px;
`;

const ConceptButton = styled.Pressable<{ selected: boolean }>`
  border-width: 1px;
  border-radius: 20px;
  padding: 5px 10px;
  border-color: ${({ selected }) =>
    selected ? theme.colors.main.primary : theme.colors.grey.neutral200};
  background-color: ${({ selected }) =>
    selected ? theme.colors.background.background500 : theme.colors.white};
`;

const ButtonText = styled.Text<{ selected: boolean }>`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${({ selected }) =>
    selected ? theme.colors.text.textPrimary : theme.colors.text.textPrimary};
`;

const MapButtonWrapper = styled.Pressable`
  border-radius: ${theme.borderRadius.lg}px;
  border-width: 1px;
  padding: 16px;
  border-color: ${theme.colors.grey.neutral200};
  gap: 5px;
  flex-direction: row;
  justify-content: space-between;
  width: 340px;
  height: 55px;
  align-self: center;
  background-color: ${theme.colors.white};
`;

const MapText = styled.View`
  flex-direction: row;
  gap: 5px;
`;

const LocationText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
`;

const InputWrapper = styled.View`
  padding: 10px;
`;

const ImageAddWrapper = styled.View`
  align-self: center;
`;

const ImageListContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-direction: row;
  gap: 10px;
`;

const ImageContainer = styled.View`
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 10px;
  overflow: visible;
`;

const SelectedImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.md}px;
`;

const RemoveButton = styled.Pressable`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${theme.colors.grey.neutral400};
  justify-content: center;
  align-items: center;
`;

const AddImageButton = styled.Pressable`
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius.md}px;
  border-width: 2px;
  border-color: ${theme.colors.grey.neutral200};
  border-style: dashed;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.grey.neutral100};
`;

const AddImageText = styled.Text`
  font-size: 32px;
  color: ${theme.colors.grey.neutral400};
`;

const AddImageSubText = styled.Text`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.grey.neutral400};
  margin-top: 4px;
`;

const ButtonWrapper = styled.View`
  padding-bottom: 16px;
  justify-content: center;
  align-items: center;
`;
