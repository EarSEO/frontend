import { useEffect, useRef, useState } from "react";

import { Alert, StyleSheet } from "react-native";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import CloseButton from "@/components/common/CloseButton";
import Input from "@/components/common/Input";
import SpotNameAdd from "@/components/storyAdd/SpotNameAdd";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/useStoryStore";
import { MapRef } from "@/types/map";
import { useSharedValue } from "react-native-reanimated";
import MapPin from "@/assets/icons/map/MapPin.svg";

import Map from "@/components/map/Map";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SpotNameSelected() {
  const { setNewSpotName, storyLocation } = useStoryStore();
  const bottomSheetRef = useRef<any>(null);
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const animatedPosition = useSharedValue(0);

  const [inputSpotName, setInputSpotName] = useState<string>("");

  useEffect(() => {
    if (storyLocation && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.moveToLocation({
          latitude: storyLocation.latitude,
          longitude: storyLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }, 500);
    }
  }, [storyLocation]);

  const handleAdd = () => {
    if (!inputSpotName) {
      Alert.alert("안넘어가지롱");
    } else {
      setNewSpotName(inputSpotName);
      router.push("/story/storyAdd");
    }
  };

  return (
    <Container>
      <GestureHandlerRootView style={styles.container}>
        <MapWrapper>
          <Map
            ref={mapRef}
            animatedPosition={animatedPosition}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
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

        <CustomBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={["45%"]}>
          <SpotNameAdd onSpotNameChange={setInputSpotName} />
        </CustomBottomSheet>
        <ButtonWrapper>
          <Button
            text="스팟 등록하기"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MapWrapper = styled.View`
  flex: 1;
`;

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
