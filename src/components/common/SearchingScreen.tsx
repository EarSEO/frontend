import { useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import styled from "styled-components/native";

import Input from "@/components/common/Input";

import { useSearch } from "@/hooks/common/useSearch";

import { theme } from "@/styles/theme";

import { useHeaderButtonStore } from "@/store/common/useHeaderButtonStore";
import { useSearchStore } from "@/store/common/useSearchStore";
import { getThemeName } from "@/util/themeUtil";

import HeaderButton from "./HeaderButton";
import LocationLabel from "./LocationLabel";

const SearchingScreen = () => {
  const router = useRouter();
  const { mapType } = useLocalSearchParams();

  const { searchSightsDebounced, searchResults, fetchSearchedLocation } =
    useSearch();
  const { setSearchLocation } = useSearchStore();

  const [searchSpotName, setsearchSpotName] = useState<string>("");

  const handleSpotNamePass = (text: string) => {
    setsearchSpotName(text);
  };

  const {
    setButtonStyle,
    setShowCloseButton,
    setShowBackButton,
    setOnBackPress,
  } = useHeaderButtonStore();

  useEffect(() => {
    setButtonStyle("NONE");
    setShowCloseButton(false);
    setShowBackButton(true);
    setOnBackPress(() => {
      router.back();
    });
  }, [setShowBackButton]);

  return (
    <Container>
      <Header>
        <HeaderButton />
      </Header>

      <InputWrapper>
        <Input
          value={searchSpotName}
          onChangeText={handleSpotNamePass}
          placeholder="관광지, 원하는 스팟을 검색해보세요."
          onSubmitEditing={() => searchSightsDebounced(searchSpotName)}
          style={{ fontSize: theme.typography.fontSize.sm }}
        />
      </InputWrapper>

      <SearchListViewWrapper>
        <SearchList>
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((item: any) => (
              <ItemWrapper key={item.storySpotId || item.sightId}>
                <LocationLabel
                  locationTitle={item?.title}
                  distance={item.distance}
                  locationType={"HOT_SPOT"}
                  locationtheme={getThemeName(item.subTheme)}
                  address={item.address}
                  onPress={() => {
                    setSearchLocation(item);
                    fetchSearchedLocation(item);
                    console.log(item);

                    router.replace({
                      pathname: "/[mapType]",
                      params: {
                        mapType: "storySpotId" in item ? "story" : "sight",
                      },
                    });
                  }}
                />
              </ItemWrapper>
            ))
          ) : (
            <NoResultText>검색 결과가 없습니다..</NoResultText>
          )}
        </SearchList>
      </SearchListViewWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  margin-bottom: 70px;
`;

const InputWrapper = styled.View`
  position: relative;
  width: 90%;
  height: 45px;
  padding: 10px;
  align-self: center;
  background-color: ${theme.colors.grey.neutral100};
  border-radius: ${theme.borderRadius.md}px;
`;

const SearchListViewWrapper = styled.ScrollView``;

const SearchList = styled.View`
  margin: 20px;
`;

const ItemWrapper = styled.View`
  padding-vertical: 5px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const NoResultText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
  margin: 10px;
`;

export default SearchingScreen;
