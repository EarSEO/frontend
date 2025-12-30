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

import { useLocation } from "@/hooks/useLocation";
import { useSightMap } from "@/hooks/useSightMap";
import { useStorySpotMap } from "@/hooks/useStorySpotMap";

import { SightInfo } from "@/types/sight";
import { GetSearchTitleRequest } from "@/types/storySpot";

import { theme } from "@/styles/theme";
import { SEOUL_GEOM } from "@/constants/geometry";
import MapPin from "@/assets/icons/map/MapPin.svg";

import { useAuthStore } from "@/store/useAuthStore";
import { useStoryStore } from "@/store/useStoryStore";

export default function SpotLocationSelected() {
  const { isLogined } = useAuthStore();
  const { location } = useLocation();

  const [isNameSelected, setIsNameSelected] = useState<boolean>(true);

  const {
    setNewSpotName,
    setStoryLocation,
    storyLocation,
    setSearchTitle,
    spotMapRectangle,
    mainStoryMapRequest,
  } = useStoryStore();

  const { mapRef, selectedMarker, handleMapPress, handleStoryMarkerPress } =
    useStorySpotMap();

  const { sights, selectedSight, fetchSightDetail } = useSightMap();

  const Ref = useRef<any>(null);
  const router = useRouter();
  const animatedPosition = useSharedValue(0);
  const [inputSpotName, setInputSpotName] = useState<string>("");

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
    if (location && !mainStoryMapRequest) {
      const pinLat = location.latitude;
      const pinLng = location.longitude;

      setStoryLocation(pinLat, pinLng);
    }
    const minLat = Number(mainStoryMapRequest?.minLatitude);
    const maxLat = Number(mainStoryMapRequest?.maxLatitude);
    const minLng = Number(mainStoryMapRequest?.minLongitude);
    const maxLng = Number(mainStoryMapRequest?.maxLongitude);

    const pinLat = (minLat + maxLat) / 2;
    const pinLng = (minLng + maxLng) / 2;

    setStoryLocation(pinLat, pinLng);

    setTimeout(() => {
      mapRef.current?.moveToLocation({
        latitude: pinLat,
        longitude: pinLng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }, 500);
  }, [mainStoryMapRequest]);

  const handleRegionChange = (bounds: {
    minLongitude: number;
    minLatitude: number;
    maxLongitude: number;
    maxLatitude: number;
  }) => {
    const pinLat = (bounds.minLatitude + bounds.maxLatitude) / 2;
    const pinLng = (bounds.minLongitude + bounds.maxLongitude) / 2;
    setStoryLocation(pinLat, pinLng);
  };

  const handleSearch = async () => {
    try {
      if (!inputSpotName.trim() || !storyLocation) {
        return;
      }
      const searchParams: GetSearchTitleRequest = {
        keyword: inputSpotName,
        longitude: storyLocation?.longitude,
        latitude: storyLocation.latitude,
        minLongitude: SEOUL_GEOM.LOGITUDE.MIN,
        minLatitude: SEOUL_GEOM.LATITUDE.MIN,
        maxLongitude: SEOUL_GEOM.LOGITUDE.MAX,
        maxLatitude: SEOUL_GEOM.LATITUDE.MAX,
        limit: "10",
      };

      await setSearchTitle(searchParams);
    } catch (error) {
      throw error;
    }
  };

  const handleMarkerPress = (sight: SightInfo) => {
    fetchSightDetail(sight, {
      longitude: location.longitude,
      latitude: location.latitude,
    });
  };

  const handleLocationAdd = () => {
    if (!storyLocation) {
      Alert.alert("위치정보를 찾을 수 없습니다.");
    } else {
      setIsNameSelected(false);
    }
  };

  const handleAdd = () => {
    setNewSpotName(inputSpotName);

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
            <SpotLocationAdd
              onSpotNameChange={setInputSpotName}
              onSearch={handleSearch}
            />
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
  top: 35%;
  left: 50%;
  z-index: 5;
  margin-left: -15px;
  margin-top: -30px;
`;
