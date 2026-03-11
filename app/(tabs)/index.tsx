import React, { useCallback, useEffect, useRef, useState } from "react";

import { FlatList, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Button from "@/components/common/Button";
import HeaderButton from "@/components/common/HeaderButton";
import CurationDetail from "@/components/curation/CurationDetail";
import CurationList from "@/components/curation/CurationList";
import Map from "@/components/map/Map";
import SightDetailCard from "@/components/sight/SightDetailCard";

import { useCurationDetail } from "@/hooks/sight/useCurationDetail";
import { useSightNavigation } from "@/hooks/sight/useSightNavigation";
import { useLocation } from "@/hooks/useLocation";
import { useSightMap } from "@/hooks/useSightMap";

import { MapRef } from "@/types/map";
import { SightInfo } from "@/types/sight";

import { theme } from "@/styles/theme";

import { RouteCartItem, useRouteCartStore } from "@/store/useRouteCartStore";

export default function Index() {
  const bottomSheetRef = useRef<any>(null);
  const animatedPosition = useSharedValue(0);
  const mapRef = useRef<MapRef | null>(null);

  const { location } = useLocation();
  const { insertRouteCartItem, removeRouteCartItem, routeCartItems } =
    useRouteCartStore();

  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);

  const {
    sights,
    selectedSight,
    sightDetail,
    isDetailLoading,
    fetchSightsDebounced,
    fetchSightDetail,
    deselectSight,
    searchSightsInBounds,
    searchResults,
  } = useSightMap();

  const {
    curations,
    isCurationLoading,
    fetchCurations,
    fetchCurationDetail,
    curationSightList,
    selectedCurationTitle,
    selectedCurationDescription,
    handleAddSightListToMy,
    setCurationSightList,
  } = useCurationDetail();

  useEffect(() => {
    fetchCurations();
  }, [fetchCurations]);

  const { navigateSightId, navigateToSight } = useSightNavigation({
    mapRef,
    location,
  });

  useEffect(() => {
    if (navigateSightId && location) {
      navigateToSight(navigateSightId);
    }
  }, [navigateSightId, location.latitude, location.longitude, navigateToSight]);

  const handleSearch = useCallback(async () => {
    if (!searchText.trim()) return;

    // 지도 bounds 가져오기
    const boundaries = await mapRef.current?.getBoundaries();
    if (!boundaries) return;

    const bounds = {
      minLongitude: boundaries.southWest.longitude,
      minLatitude: boundaries.southWest.latitude,
      maxLongitude: boundaries.northEast.longitude,
      maxLatitude: boundaries.northEast.latitude,
    };

    // 검색 API 호출
    await searchSightsInBounds(
      searchText,
      {
        longitude: location.longitude,
        latitude: location.latitude,
      },
      bounds
    );

    setShowResults(true);
    Keyboard.dismiss();
  }, [searchText, location, searchSightsInBounds]);

  // 검색 결과 선택 시
  const handleSelectResult = (sight: SightInfo) => {
    setShowResults(false);
    setSearchText("");

    mapRef.current?.moveToLocation({
      latitude: sight.latitude,
      longitude: sight.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    fetchSightDetail(sight, {
      longitude: location.longitude,
      latitude: location.latitude,
    });
  };

  const isInCart = routeCartItems.some(
    (item) => item.sightId === selectedSight?.id
  );

  const handleToggleRoute = () => {
    if (!sightDetail || !selectedSight) return;

    if (isInCart) {
      removeRouteCartItem(selectedSight.id);
    } else {
      const cartItem: RouteCartItem = {
        sightId: selectedSight.id,
        theme: sightDetail.theme,
        title: sightDetail.title,
        address: sightDetail.address,
        point: {
          longitude: sightDetail.longitude,
          latitude: sightDetail.latitude,
        },
        imageUrl: sightDetail.imgUrl,
      };
      insertRouteCartItem(cartItem);
    }
  };

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

        <OverlayWrapper>
          <SearchContainer>
            <SearchInputWrapper>
              <Ionicons name="search" size={20} color="#888" />
              <SearchInput
                placeholder="관광지 검색..."
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
              )}
            </SearchInputWrapper>
          </SearchContainer>

          {showResults && searchResults.length > 0 && (
            <SearchResultsContainer>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ResultItem onPress={() => handleSelectResult(item)}>
                    <ResultTitle>{item.title}</ResultTitle>
                  </ResultItem>
                )}
                keyboardShouldPersistTaps="handled"
              />
            </SearchResultsContainer>
          )}

          <CustomBottomSheet
            bottomSheetRef={bottomSheetRef}
            animatedPosition={animatedPosition}
          >
            {selectedSight ? (
              <SightDetailCard
                selectedSight={selectedSight}
                sightDetail={sightDetail}
                isDetailLoading={isDetailLoading}
                isInCart={isInCart}
                onToggleRoute={handleToggleRoute}
                onClose={deselectSight}
              />
            ) : curationSightList !== undefined ? (
              <>
                <CurationDetail
                  curationSightList={curationSightList}
                  selectedCurationTitle={selectedCurationTitle}
                  selectedCurationDescription={selectedCurationDescription}
                  handleCardPress={fetchSightDetail}
                  handleHeaderBackPress={() => setCurationSightList(undefined)}
                />
              </>
            ) : (
              <CurationList
                curations={curations}
                isLoading={isCurationLoading}
                onCurationSelect={fetchCurationDetail}
              />
            )}
          </CustomBottomSheet>

          {curationSightList && !selectedSight ? (
            <ButtonWrapper>
              <Button
                text="이 경로로 여행을 떠나보세요."
                fontSize={theme.typography.fontSize.sm}
                width="90%"
                onPress={handleAddSightListToMy}
              />
            </ButtonWrapper>
          ) : null}
        </OverlayWrapper>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const OverlayWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const SearchContainer = styled.View`
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
`;

const SearchInputWrapper = styled.View`
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

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  font-size: 16px;
`;

const SearchResultsContainer = styled.View`
  position: absolute;
  top: 120px;
  left: 16px;
  right: 16px;
  max-height: 300px;
  background-color: white;
  border-radius: 12px;
  z-index: 10;
  elevation: 4;
`;

const ResultItem = styled.TouchableOpacity`
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const ResultTitle = styled.Text`
  font-size: 15px;
  color: #333;
`;

const ButtonWrapper = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 999;

  justify-content: center;
  align-items: center;
  margin-top: auto;
`;
