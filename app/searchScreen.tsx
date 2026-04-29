import { useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import styled from "styled-components/native";

import SearchingScreen from "@/components/common/SearchingScreen";

export default function searchScreen() {
  return (
    <StyledSafeAreaView edges={["top", "left", "right"]}>
      <SearchingScreen />
    </StyledSafeAreaView>
  );
}

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`;
