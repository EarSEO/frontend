import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { useCustomPinNavigation } from "@/hooks/story/useCustomPinNavigation";
import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

import Input from "../common/Input";
import LocationLabel from "../common/LocationLabel";

const SpotLocationAdd = () => {
  const { setSelectedSpot, moveToCustomPinLocation } = useCustomPinNavigation();
  const { searchedStoryInfo } = useStoryStore();
  const { selectedSpotId, setStoryLocation } = useStoryAddStore();

  const { mapRef, setInputSpotName, inputSpotName, handleSearch } =
    useStorySpotMap();

  const handleSpotNamePass = (text: string) => {
    setInputSpotName(text);
  };

  const handleSearchedSpot = (
    spotId: number,
    spotTitle: string | undefined,
    latitude: number,
    logitude: number
  ) => {
    if (selectedSpotId === spotId) {
      setSelectedSpot(undefined, undefined);
    } else {
      setSelectedSpot(spotId, spotTitle);
      setStoryLocation(latitude, logitude);
      moveToCustomPinLocation(mapRef, latitude, logitude);
    }
  };

  return (
    <Container>
      <Content>
        <InputWrapper>
          <StyledInput
            value={inputSpotName}
            onChangeText={handleSpotNamePass}
            placeholder="검색어를 입력하세요."
            onSubmitEditing={handleSearch}
          />
          <SearchButtonWrapper onPress={handleSearch}>
            <Ionicons
              name="search"
              size={18}
              color={theme.colors.grey.neutral600}
            />
          </SearchButtonWrapper>
        </InputWrapper>

        <SearchListViewWrapper>
          <SearchList>
            {searchedStoryInfo && searchedStoryInfo.length > 0 ? (
              searchedStoryInfo?.map((item) => (
                <LocationLabel
                  key={item.storySpotId}
                  locationTitle={item.title}
                  latitude={item.latitude}
                  logitude={item.longitude}
                  isSelected={selectedSpotId === item.storySpotId}
                  onPress={() =>
                    handleSearchedSpot(
                      item.storySpotId,
                      item?.title,
                      item.latitude,
                      item.longitude
                    )
                  }
                />
              ))
            ) : (
              <NoResultText>검색 결과가 없습니다..</NoResultText>
            )}
          </SearchList>
        </SearchListViewWrapper>
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  position: relative;
`;

const Content = styled.View`
  flex: 1;
`;

const InputWrapper = styled.View`
  position: relative;
`;

const SearchButtonWrapper = styled.Pressable`
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  padding: 8px;
  justify-content: center;
  align-items: center;
`;

const SearchListViewWrapper = styled.ScrollView`
  padding: 20px;
  padding-bottom: 80px;
`;

const SearchList = styled.View`
  gap: 15px;
`;
const NoResultText = styled.Text`
  padding: 12px;
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
`;

const StyledInput = styled(Input)`
  padding-right: 45px;
  border-radius: 10px;
  background-color: ${theme.colors.grey.neutral100};
  font-size: ${theme.typography.fontSize.sm}px;
`;

export default SpotLocationAdd;
