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

type StoryConcept = "TIP" | "EXPERIENCE" | "CULTURE" | "HISTORY" | "ETC";

const CONCEPTS = [
  { value: "TIP", label: "🍯꿀팁" },
  { value: "EXPERIENCE", label: "🗣️경험담" },
  { value: "CULTURE", label: "🎩문화" },
  { value: "HISTORY", label: "🏛️역사" },
  { value: "ETC", label: "👀기타" },
] as const;

export default function StoryAdd() {
  const [content, setContent] = useState<string>();
  const [selectedConcept, setSelectedConcept] = useState<StoryConcept | null>(
    null
  );
  const { user } = useAuthStore();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { newSpotName, storyMain } = useStoryStore();
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleAdd = () => {
    if (!content || !newSpotName || !selectedConcept) {
      alert("하나라도 빠지면 안해주지롱");
    } else {
      console.log("새로운 스팟 이름", newSpotName);
      console.log("선택된 컨셉:", selectedConcept);
      console.log(user?.memberId);
    }
  };

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
