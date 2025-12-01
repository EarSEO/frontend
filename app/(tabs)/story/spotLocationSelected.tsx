import { useRef, useState } from "react";

import { Alert, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import CloseButton from "@/components/common/CloseButton";
import Input from "@/components/common/Input";
import Map from "@/components/map/Map";
import SpotLocationAdd from "@/components/storyAdd/SpotLocationAdd";

import { MapRef } from "@/types/map";
import { GetSearchTitleRequest } from "@/types/storySpot";

import { theme } from "@/styles/theme";
import MapPin from "@/assets/icons/map/MapPin.svg";

import { getSearchTitle } from "@/api/getStoryApi";
import { useStoryStore } from "@/store/useStoryStore";

export default function SpotLocationSelected() {
  const { setNewSpotName, setStoryLocation } = useStoryStore();
  const Ref = useRef<any>(null);
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const animatedPosition = useSharedValue(0);

  const [inputSpotName, setInputSpotName] = useState<string>("");

  const [centerCoordinate, setCenterCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });

  const handleAdd = () => {
    if (!centerCoordinate) {
      Alert.alert("안넘어가지롱");
    } else {
      setNewSpotName(inputSpotName);
      router.push("/story/spotNameSelected");
    }
  };

  const handleRegionChange = async (bounds: {
    minLongitude: number;
    minLatitude: number;
    maxLongitude: number;
    maxLatitude: number;
  }) => {
    try {
      const centerLat = (bounds.minLatitude + bounds.maxLatitude) / 2;
      const centerLng = (bounds.minLongitude + bounds.maxLongitude) / 2;

      setCenterCoordinate({
        latitude: centerLat,
        longitude: centerLng,
      });
      setStoryLocation(centerLat, centerLng);

      const searchTitleInfo: GetSearchTitleRequest = {
        keyword: inputSpotName,
        longitude: centerLng.toString(),
        latitude: centerLat.toString(),
        minLongitude: bounds.minLongitude.toString(),
        minLatitude: bounds.minLatitude.toString(),
        maxLongitude: bounds.maxLongitude.toString(),
        maxLatitude: bounds.maxLatitude.toString(),
        limit: "10",
      };
      const result = await getSearchTitle(searchTitleInfo);
    } catch (error) {
      throw error;
    }
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <MapWrapper>
          <Map
            ref={mapRef}
            animatedPosition={animatedPosition}
            onRegionChangeComplete={handleRegionChange}
          />
          <CenterPin>
            <MapPin width={45} height={45} />
          </CenterPin>
        </MapWrapper>

        <Header>
          <BackButton buttonStyle="CIRCLE" />
          <Input
            value={inputSpotName}
            width={200}
            radius={theme.borderRadius.xl}
            fontSize={theme.typography.fontSize.sm}
            editable={false}
          />
          <CloseButton buttonStyle="CIRCLE" onPress={"./"} />
        </Header>

        <CustomBottomSheet bottomSheetRef={Ref} snapPoints={["45%", "85%"]}>
          <SpotLocationAdd onSpotNameChange={setInputSpotName} />
        </CustomBottomSheet>
        <ButtonWrapper>
          <Button
            text="이 위치에서 이야기 등록하기"
            onPress={handleAdd}
            width="90%"
            fontSize={theme.typography.fontSize.sm}
          />
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

const PinIcon = styled.Text`
  font-size: 30px;
`;
