import React, { useEffect, useRef } from "react";

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Map from "@/components/map/Map";

import { useLocation } from "@/hooks/useLocation";
import { useSightMap } from "@/hooks/useSightMap";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";

export default function Index() {
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef>(null);
  const { location } = useLocation();

  const {
    sights,
    selectedSight,
    sightDetail,
    isLoading,
    isDetailLoading,
    fetchSightsDebounced,
    fetchSightDetail,
    deselectSight,
  } = useSightMap();

  // 지도 영역 변경 시 관광지 조회
  const handleRegionChangeComplete = (bounds: {
    minLongitude: number;
    minLatitude: number;
    maxLongitude: number;
    maxLatitude: number;
  }) => {
    fetchSightsDebounced(bounds);
  };

  // 마커 클릭 시
  const handleMarkerPress = (sight: SightInfo) => {
    fetchSightDetail(sight, {
      longitude: location.longitude,
      latitude: location.latitude,
    });
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <Map
          ref={mapRef}
          animatedPosition={animatedPosition}
          markers={sights}
          selectedMarkerId={selectedSight?.id}
          onMarkerPress={handleMarkerPress}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
        <CustomBottomSheet
          bottomSheetRef={bottomSheetRef}
          animatedPosition={animatedPosition}
        >
          {selectedSight ? (
            <SightDetailView>
              <SightTitle>{selectedSight.title}</SightTitle>
              {isDetailLoading ? (
                <LoadingText>상세 정보 로딩 중...</LoadingText>
              ) : sightDetail ? (
                <>
                  <SightDistance>{sightDetail.distance}km</SightDistance>
                  <SightDistance>{sightDetail.theme}테마</SightDistance>
                  <SightText>{sightDetail.address}</SightText>
                  <SectionTitle>썸네일</SectionTitle>
                  <SectionTitle>정보/이야기</SectionTitle>
                  <SectionTitle>도슨트 듣기</SectionTitle>
                  <SectionTitle>소개</SectionTitle>
                  <SightDescription numberOfLines={10}>
                    {sightDetail.outl}
                  </SightDescription>
                  <SectionTitle>방문정보</SectionTitle>
                  <SightText>주소 : {sightDetail.fullAddress}</SightText>
                  <SightText>전화번호 : {sightDetail.tel}</SightText>
                  <SightText>운영시간: {sightDetail.useTime}</SightText>
                  <SightText>휴무일 : {sightDetail.restDate}</SightText>
                  <SightText>입장료 : {sightDetail.useFee}</SightText>
                  <SightText>주차 : {sightDetail.parking}</SightText>
                </>
              ) : null}
              <CloseButton onPress={deselectSight}>
                <CloseButtonText>닫기</CloseButtonText>
              </CloseButton>
            </SightDetailView>
          ) : (
            <DefaultView>
              <InfoText>관광지 개수: {sights.length}</InfoText>
              <InfoText>마커를 눌러 상세 정보를 확인하세요</InfoText>
            </DefaultView>
          )}
        </CustomBottomSheet>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const SightDetailView = styled.View`
  gap: 8px;
`;

const SightTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const SightText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const SightDistance = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.main.primary};
`;

const SightDescription = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
  line-height: 22px;
`;

const LoadingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textTertiary};
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.grey.neutral100};
  border-radius: 8px;
  align-items: center;
`;

const CloseButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const DefaultView = styled.View`
  gap: 8px;
`;

const InfoText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
