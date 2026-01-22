import { useCallback, useEffect, useRef, useState } from "react";

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

import { theme } from "@/styles/theme";
import MapPin from "@/assets/icons/map/MapPin.svg";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";
import { useStoryStore } from "@/store/story/useStoryStore";
import { useAuthStore } from "@/store/useAuthStore";
import {useLocationStore} from "@/store/useLocationStore";

export default function SpotLocationSelected() {
  const { spotLocationInMap, mainStoryMapRequest } = useStoryStore();

  const {
    mapRef,
    selectedMarker,
    handleMapPress,
    handleStoryMarkerPress,
    handleSightMarkerPress,
  } = useStorySpotMap();

  const { resetSearchStory, resetStoryInfo, resetStorySpotInfo } =
    useStoryStore();

  const { moveToCustomPinLocation, getCustomPinLoction } =
    useCustomPinNavigation();

  const {
    storyLocation,
    resetNewSpotName,
    selectedSpotTitle,
    resetSavedStorySpot,
  } = useStoryAddStore();

  const { isLogined } = useAuthStore();
  const location = useLocationStore(state => state.location);
  const { sights, selectedSight } = useSightMap();

  const Ref = useRef<any>(null);
  const router = useRouter();
  const animatedPosition = useSharedValue(0);

  const [isNameSelected, setIsNameSelected] = useState<boolean>(true); // 이름 등록할 때 지도 움직임 false
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false); // 버튼 중복 클릭 방지

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

  useEffect(() => {
    resetSearchStory();
    resetNewSpotName();
    resetStoryInfo();
    resetSavedStorySpot();
    resetStorySpotInfo();
  }, []);

  //등록 페이지 들어오기 전 지도 화면 기반 핀 이동
  useEffect(() => {
    if (location) {
      moveToCustomPinLocation(mapRef, location.latitude, location.longitude);
      return;
    }

    if (mainStoryMapRequest) {
      const minLatitude = Number(mainStoryMapRequest.minLatitude);
      const maxLatitude = Number(mainStoryMapRequest.maxLatitude);
      const minLongitude = Number(mainStoryMapRequest.minLongitude);
      const maxLongitude = Number(mainStoryMapRequest.maxLongitude);

      const mapLat = (minLatitude + maxLatitude) / 2;
      const mapLng = (minLongitude + maxLongitude) / 2;

      moveToCustomPinLocation(mapRef, mapLat, mapLng);
    }
  }, [location, mainStoryMapRequest]);

  //지도 이동 시 위치저장
  const handleRegionChange = useCallback(
    (bounds: {
      minLongitude: number;
      minLatitude: number;
      maxLongitude: number;
      maxLatitude: number;
    }) => {
      getCustomPinLoction(bounds);
    },
    []
  );

  const handleLocationAdd = () => {
    if (!storyLocation) {
      Alert.alert("위치정보를 찾을 수 없습니다.");
    } else {
      setIsNameSelected(false);
    }
  };

  const handleAdd = () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500);

    router.push("/story/storyAdd");
  };

  const handleCloseButton = () => {
    router.replace("/story");
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <MapWrapper>
          <StorySpotMap
            ref={mapRef}
            animatedPosition={animatedPosition}
            onRegionChangeComplete={handleRegionChange}
            storyMarkers={spotLocationInMap}
            onStoryMarkerPress={handleStoryMarkerPress}
            selectedStoryMarkerId={selectedMarker}
            sightMarkers={sights}
            onSightMarkerPress={handleSightMarkerPress}
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
            <SpotName>{selectedSpotTitle}</SpotName>
            <CloseButton buttonStyle="CIRCLE" onPress={handleCloseButton} />
          </Header>
        </MapWrapper>

        <CustomBottomSheet
          animatedPosition={animatedPosition}
          bottomSheetRef={Ref}
          keyboardBehavior="interactive"
          snapPoints={["25%", "50%", "85%"]}
          initialIndex={1}
        >
          {isNameSelected ? <SpotLocationAdd /> : <SpotNameAdd />}
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

const SpotName = styled.TextInput`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.md}px;
  background-color: ${theme.colors.white};
  border-radius: 20px;
  text-align: center;
  height: 40px;
  width: 200px;
`;

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
