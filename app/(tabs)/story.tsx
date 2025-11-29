import React, { useRef } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Map from "@/components/map/Map";

export default function Story() {
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map animatedPosition={animatedPosition} />
        <CustomBottomSheet
          bottomSheetRef={bottomSheetRef}
          animatedPosition={animatedPosition}
        >
          <Text>이야기 바텀시트</Text>
        </CustomBottomSheet>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Text = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
