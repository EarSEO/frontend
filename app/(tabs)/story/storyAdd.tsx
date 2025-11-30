import { useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ChevronRight, MapPin, X } from "lucide-react-native";
import styled from "styled-components/native";

import CloseButton from "@/components/common/CloseButton";
import Input from "@/components/common/Input";

import { theme } from "@/styles/theme";

export default function StoryAdd() {
  const router = useRouter();
  const handleMapButton = () => {
    router.push("./");
  };

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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

  return (
    <Container>
      <Header>
        <CloseButton buttonStyle="NONE" onPress={"/story"} />
      </Header>
      <StoryAddContainer>
        <TitleWrapper>
          <Title>이야기 등록</Title>
        </TitleWrapper>
        <StoryConcept></StoryConcept>
        <MapButtonWrapper onPress={handleMapButton}>
          <MapText>
            <MapPin size={24} />
            <LocationText>경복궁 파스타</LocationText>
          </MapText>
          <ChevronRight size={20} />
        </MapButtonWrapper>
        <InputWrapper>
          <Input
            width={340}
            height={300}
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
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  gap: 10px;
  background-color: ${theme.colors.background.background300};
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
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.text.textPrimary};
`;

const StoryConcept = styled.View``;

const MapButtonWrapper = styled.Pressable`
  border-radius: ${theme.borderRadius.lg}px;
  border-width: 1px;
  padding: 16px;
  border-color: ${theme.colors.grey.neutral200};
  gap: 5px;
  flex-direction: row;
  justify-content: space-between;
  width: 340px;
  align-self: center;
  background-color: ${theme.colors.white};
`;

const MapText = styled.View`
  flex-direction: row;
  gap: 5px;
`;

const LocationText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md};
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
  font-size: 12px;
  color: ${theme.colors.grey.neutral400};
  margin-top: 4px;
`;
