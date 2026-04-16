import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";

import Input from "../common/Input";
import LocationLabel from "../common/LocationLabel";

const SpotLocationAdd = () => {
  const { searchResults, OnSpotSearch } = useStorySpotMap();
  const { setSearchedSpot } = useStoryStore();
  const searchedSpot = useStoryStore((state) => state.searchedSpot);

  const [searchSpotName, setsearchSpotName] = useState<string>("");

  const handleSpotNamePass = (text: string) => {
    setsearchSpotName(text);
  };

  return (
    <Container>
      <Content>
        <InputWrapper>
          <StyledInput
            value={searchSpotName}
            onChangeText={handleSpotNamePass}
            placeholder="검색어를 입력하세요."
            onSubmitEditing={() => OnSpotSearch(searchSpotName)}
          />
          <SearchButtonWrapper onPress={() => OnSpotSearch(searchSpotName)}>
            <Ionicons
              name="search"
              size={18}
              color={theme.colors.grey.neutral600}
            />
          </SearchButtonWrapper>
        </InputWrapper>

        <SearchListViewWrapper>
          <SearchList>
            {searchResults && searchResults.length > 0 ? (
              searchResults?.map((item) => (
                <LocationLabel
                  key={item.storySpotId}
                  locationTitle={item?.title}
                  distance={item.distance}
                  isSelected={searchedSpot?.storySpotId === item.storySpotId}
                  onPress={() => {
                    setSearchedSpot(item);
                  }}
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
