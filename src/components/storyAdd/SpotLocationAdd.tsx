import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { GetSearchTitleRequest } from "@/types/storySpot";

import { theme } from "@/styles/theme";
import { SEOUL_GEOM } from "@/constants/geometry";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

import Input from "../common/Input";
import LocationLabel from "../common/LocationLabel";

type SpotLocationAddProps = {
  onSelectSpotId: (id: number) => void;
};

const SpotLocationAdd = ({ onSelectSpotId }: SpotLocationAddProps) => {
  const { searchTitleInfo, setSearchTitle } = useStoryStore();
  const { storyLocation } = useStoryAddStore();
  const [inputSpotName, setInputSpotName] = useState<string>("");
  const [selectedSpotId, setSelectedSpotId] = useState<number | undefined>();

  const handleSpotNamePass = (text: string) => {
    setInputSpotName(text);
  };

  const handleSearch = async () => {
    try {
      if (!storyLocation) {
        return;
      }
      const searchParams: GetSearchTitleRequest = {
        keyword: inputSpotName,
        longitude: storyLocation.longitude,
        latitude: storyLocation.latitude,
        minLongitude: SEOUL_GEOM.LOGITUDE.MIN,
        minLatitude: SEOUL_GEOM.LATITUDE.MIN,
        maxLongitude: SEOUL_GEOM.LOGITUDE.MAX,
        maxLatitude: SEOUL_GEOM.LATITUDE.MAX,
        limit: "10",
      };
      await setSearchTitle(searchParams);
    } catch (error) {
      throw error;
    }
  };
  const handleSelectedSpot = (spotId: number) => {
    setSelectedSpotId(spotId);
    onSelectSpotId(spotId);
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
            {searchTitleInfo ? (
              searchTitleInfo?.map((item) => (
                <LocationLabel
                  key={item.storySpotId}
                  locationTitle={item.title}
                  latitude={item.latitude}
                  logitude={item.longitude}
                  isSelected={selectedSpotId === item.storySpotId}
                  onPress={() => handleSelectedSpot(item.storySpotId)}
                />
              ))
            ) : inputSpotName.trim() ? null : (
              <NoResultText>검색 결과가 없습니다</NoResultText>
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
  padding: 25px;
  flex: 1;
`;

const SearchList = styled.View`
  gap: 15px;
`;
const NoResultText = styled.Text`
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
