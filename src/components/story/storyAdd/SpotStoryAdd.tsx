import { useEffect } from "react";

import { ChevronRight, MapPin, X } from "lucide-react-native";
import styled from "styled-components/native";

import Button from "@/components/common/Button";
import HeaderButton from "@/components/common/HeaderButton";
import Input from "@/components/common/Input";

import { CONCEPTS, StoryConcept, useStoryAdd } from "@/hooks/story/useStoryAdd";

import { theme } from "@/styles/theme";

import { useHeaderButtonStore } from "@/store/common/useHeaderButtonStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";

const SpotStoryAdd = () => {
  const {
    setButtonStyle,
    setShowCloseButton,
    setShowBackButton,
    setOnClosePress,
  } = useHeaderButtonStore();

  const {
    handleRemoveImage,
    handleAdd,
    handlePickImage,
    selectedConcept,
    setSelectedConcept,
    content,
    setContent,
    selectedImages,
    handleMapButton,
  } = useStoryAdd();

  const { setStoryAddStep, setNewSpotName, setStoryLocation } =
    useStoryAddStore();
  const newSpotName = useStoryAddStore((state) => state.newSpotName);

  useEffect(() => {
    setButtonStyle("NONE");
    setShowCloseButton(true);
    setShowBackButton(false);
    setOnClosePress(() => {
      setNewSpotName(undefined);
      setStoryLocation(undefined);
      setStoryAddStep("none");
    });
  }, [setShowCloseButton]);

  return (
    <Container>
      <ScrollContainer>
        <Header>
          <HeaderButton />
        </Header>

        <StoryAddContainer>
          <TitleWrapper>
            <Title>Add Story</Title>
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
};

const Container = styled.SafeAreaView`
  flex: 1;
  gap: 10px;
  background-color: ${theme.colors.background.background300};
`;
const ScrollContainer = styled.ScrollView`
  flex: 1;
`;
const Header = styled.View`
  margin-bottom: 60px;
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
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.grey.neutral400};
`;

const AddImageSubText = styled.Text`
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.grey.neutral400};
  margin-top: 4px;
`;

const ButtonWrapper = styled.View`
  padding-bottom: 16px;
  justify-content: center;
  align-items: center;
`;

export default SpotStoryAdd;
