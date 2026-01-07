import { useEffect, useRef, useState } from "react";

import { Alert, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import CloseButton from "@/components/common/CloseButton";
import StorySpotMap from "@/components/map/StorySpotMap";
import SpotLocationAdd from "@/components/storyAdd/SpotLocationAdd";
import SpotNameAdd from "@/components/storyAdd/SpotNameAdd";

import { useCustomPinNavigation } from "@/hooks/story/useCustomPinNavigation";
import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";
import { useLocation } from "@/hooks/useLocation";
import { useSightMap } from "@/hooks/useSightMap";

import { SightInfo } from "@/types/sight";

import { theme } from "@/styles/theme";
import MapPin from "@/assets/icons/map/MapPin.svg";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function SpotLocationSelected() {
  const { spotMapRectangle, mainStoryMapRequest, spotBriefInfo } =
    useStoryStore();

  const { mapRef, selectedMarker, handleMapPress, handleStoryMarkerPress } =
    useStorySpotMap();

  const { resetSearchTitle } = useStoryStore();

  const { moveToCustomPinLocation, getCustomPinLoction } =
    useCustomPinNavigation();

  const { storyLocation } = useStoryAddStore();

  const { isLogined } = useAuthStore();
  const { location } = useLocation();

  const Ref = useRef<any>(null);
  const router = useRouter();
  const animatedPosition = useSharedValue(0);

  const [isNameSelected, setIsNameSelected] = useState<boolean>(true); // 이름 등록할 때 지도 움직임 false
  const [searchedSpotId, setSearchedSpotId] = useState<number | null>(null); // 선택된 검색어 id
  const selectedSpotName = spotBriefInfo?.titles;

  const { sights, selectedSight } = useSightMap();

  useEffect(() => {
    if (!isLogined) {
      Alert.alert("로그아웃", "로그인이 필요합니다.", [
        {
          text: "확인",
          onPress: () => router.push("/myPage/login"),
        },
      ]);
    }
  }, [isLogined]);

  //등록 페이지 들어오기 전 지도 화면 기반 핀 이동
  useEffect(() => {
    resetSearchTitle();

    if (!location) {
      return;
    }
    if (location && !mainStoryMapRequest) {
      moveToCustomPinLocation(mapRef, location.latitude, location.longitude);
    }

    const minLatitude = Number(mainStoryMapRequest?.minLatitude);
    const maxLatitude = Number(mainStoryMapRequest?.maxLatitude);
    const minLongitude = Number(mainStoryMapRequest?.minLongitude);
    const maxLongitude = Number(mainStoryMapRequest?.maxLongitude);

    const mapLat = (minLatitude + maxLatitude) / 2;
    const mapLng = (minLongitude + maxLongitude) / 2;

    console.log(mapLat, mapLng);
    console.log("\n");

    (mapRef.current?.moveToLocation({
      latitude: mapLat,
      longitude: mapLng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
      console.log("처음 들어올 때 위도 경도? 값 ", mapLat, mapLng));
    console.timeLog("\n");
  }, [location, mainStoryMapRequest]);

  //등록 페이지에서 지도 움직이기
  const handleRegionChange = (bounds: {
    minLongitude: number;
    minLatitude: number;
    maxLongitude: number;
    maxLatitude: number;
  }) => {
    getCustomPinLoction(bounds);
  };

  //마커선택 시 지도 이동
  const handleMarkerPress = (sight: SightInfo) => {
    const mapLat = sight.latitude;
    const mapLng = sight.longitude;

    moveToCustomPinLocation(mapRef, mapLat, mapLng);
  };

  const handleLocationAdd = () => {
    if (!storyLocation) {
      Alert.alert("위치정보를 찾을 수 없습니다.");
    } else {
      setIsNameSelected(false);
    }
  };

  const handleAdd = () => {
    router.push("/story/storyAdd");
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <MapWrapper>
          <StorySpotMap
            ref={mapRef}
            animatedPosition={animatedPosition}
            onRegionChangeComplete={handleRegionChange}
            storyMarkers={spotMapRectangle}
            onStoryMarkerPress={handleStoryMarkerPress}
            selectedStoryMarkerId={selectedMarker?.storySpotId}
            sightMarkers={sights}
            onSightMarkerPress={handleMarkerPress}
            selectedSightMarkerId={selectedSight?.id}
            onMapPress={handleMapPress}
            scrollEnabled={isNameSelected}
            zoomEnabled={isNameSelected}
            rotateEnabled={isNameSelected}
            pitchEnabled={isNameSelected}
          />
          <CenterPin>
            <MapPin width={45} height={45} />
          </CenterPin>

          <Header>
            <BackButton buttonStyle="CIRCLE" />
            <StorySpotName>{selectedSpotName}</StorySpotName>
            <CloseButton buttonStyle="CIRCLE" onPress={"./"} />
          </Header>
        </MapWrapper>

        <CustomBottomSheet
          animatedPosition={animatedPosition}
          bottomSheetRef={Ref}
          snapPoints={["20%", "50%"]}
          initialIndex={2}
          keyboardBehavior="interactive"
        >
          {isNameSelected ? (
            <SpotLocationAdd onSelectSpotId={setSearchedSpotId} />
          ) : (
            <SpotNameAdd />
          )}
        </CustomBottomSheet>

        <ButtonWrapper>
          {isNameSelected ? (
            <Button
              text="이 위치에서 이야기 등록하기"
              onPress={handleLocationAdd}
              width="90%"
              fontSize={theme.typography.fontSize.sm}
            />
          ) : (
            <Button
              text="스팟 등록하기"
              onPress={handleAdd}
              width="90%"
              fontSize={theme.typography.fontSize.sm}
            />
          )}
        </ButtonWrapper>
      </GestureHandlerRootView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const MapWrapper = styled.View`
  flex: 1;
`;

const StorySpotName = styled.TextInput``;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Header = styled.View`
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
  z-index: 10;

  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
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
const CenterPin = styled.View`
  position: absolute;
  top: 30%;
  left: 48%;
  z-index: 5;
  margin-left: -15px;
  margin-top: -30px;
`;
