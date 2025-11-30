import React, { useRef } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Map from "@/components/map/Map";

import { MapRef } from "@/types/map";

export default function Story() {
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);

  // 현재 화면 경계 좌표 가져오기
  const handleGetBoundaries = async () => {
    const boundaries = await mapRef.current?.getBoundaries();
    console.log("현재 화면 경계:", boundaries);
  };

  // 여러 포인트가 모두 보이도록 화면 조정
  const handleFitToPoints = () => {
    const dummySpots = [
      { latitude: 37.5666805, longitude: 126.9784147 }, // 서울 시청
      { latitude: 37.5512, longitude: 126.9882 }, // 남산타워
      { latitude: 37.5796, longitude: 126.977 }, // 경복궁
    ];
    mapRef.current?.fitToPoints(dummySpots);
  };

  // 특정 위치로 이동
  const handleMoveToLocation = () => {
    mapRef.current?.moveToLocation({
      latitude: 37.5666805,
      longitude: 126.9784147,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map ref={mapRef} animatedPosition={animatedPosition} />
        <CustomBottomSheet
          bottomSheetRef={bottomSheetRef}
          animatedPosition={animatedPosition}
        >
          <ButtonGroup>
            <TestButton onPress={handleGetBoundaries}>
              <ButtonText>경계값 가져오기(로그용)</ButtonText>
            </TestButton>
            <TestButton onPress={handleFitToPoints}>
              <ButtonText>서울시청/남산타워/경복궁 포인트로 이동</ButtonText>
            </TestButton>
            <TestButton onPress={handleMoveToLocation}>
              <ButtonText>서울 시청으로 이동</ButtonText>
            </TestButton>
          </ButtonGroup>
        </CustomBottomSheet>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const ButtonGroup = styled.View`
  gap: 8px;
`;

const TestButton = styled.TouchableOpacity`
  padding: 16px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  text-align: center;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
