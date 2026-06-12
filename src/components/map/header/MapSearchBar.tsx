import React from "react";

import { NativeSyntheticEvent, NativeTouchEvent } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface MapSearchBarProps {
  placeHolder: string;
  onPressMapSearchBar?: () => void;
}

const MapSearchBar = ({
  placeHolder,
  onPressMapSearchBar,
}: MapSearchBarProps) => {
  return (
    <SearchInputWrapper
      onPress={(e: NativeSyntheticEvent<NativeTouchEvent>) => {
        router.push("/searchScreen");
        e.stopPropagation();
        if (onPressMapSearchBar) onPressMapSearchBar();
      }}
    >
      <Ionicons name="search" size={20} color="#888" />
      <SearchInput style={{ color: theme.colors.grey.neutral400 }}>
        {placeHolder}
      </SearchInput>
    </SearchInputWrapper>
  );
};

const SearchInputWrapper = styled.Pressable`
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 12px 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const SearchInput = styled.Text`
  flex: 1;
  margin-left: 10px;
  font-size: 16px;
`;

export default React.memo(MapSearchBar);
