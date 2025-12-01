import { useRef, useState } from "react";

import { Alert } from "react-native";

import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import CloseButton from "@/components/common/CloseButton";
import Input from "@/components/common/Input";
import SpotLocationAdd from "@/components/storyAdd/SpotLocationAdd";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/useStoryStore";

export default function SpotLocationSelected() {
  const { setNewSpotName } = useStoryStore();
  const Ref = useRef<any>(null);
  const router = useRouter();

  const [inputSpotName, setInputSpotName] = useState<string>("");

  const handleAdd = () => {
    if (!inputSpotName) {
      Alert.alert("안넘어가지롱");
    } else {
      setNewSpotName(inputSpotName);
      router.push("/story/spotNameSelected");
    }
  };

  return (
    <Container>
      <MapWrapper>
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
      </MapWrapper>

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
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const MapWrapper = styled.View`
  flex: 1;
`;

const Header = styled.View`
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
