import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import MapSearchBar from "@/components/map/header/MapSearchBar";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";

import LocationLabel from "../../common/LocationLabel";

const SpotLocationAdd = () => {
  const router = useRouter();
  const pinAddress = useStoryAddStore((state) => state.pinAddress);
  const nameAddress = pinAddress?.name;
  const { setStoryAddStep } = useStoryAddStore();

  const { setNewSpotName, setPinAddress, setStoryLocation } =
    useStoryAddStore();

  const handleBackButton = () => {
    setStoryLocation(undefined);
    setNewSpotName(undefined);
    setPinAddress(undefined);
    setStoryAddStep("none");
  };

  return (
    <Container>
      <HeaderRow>
        <BackButton onPress={handleBackButton}>
          <Ionicons name="chevron-back-outline" size={24} />
        </BackButton>

        <SearchBarWrapper>
          <MapSearchBar
            placeHolder="관광지, 원하는 스팟을 검색해보세요."
            onPressMapSearchBar={() => {
              router.push("/searchScreen");
            }}
          />
        </SearchBarWrapper>
      </HeaderRow>
      <Content>
        {pinAddress ? (
          <LocationLabelWrapper>
            <LocationLabel
              locationType={"HOT_SPOT"}
              locationTitle={nameAddress}
            />
          </LocationLabelWrapper>
        ) : (
          <NoResultText>지도를 움직여 스팟을 지정해주세요. </NoResultText>
        )}
      </Content>
      <ButtonWrapper></ButtonWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

const BackButton = styled.Pressable`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  background-color: white;
`;
const SearchBarWrapper = styled.View`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
`;

const LocationLabelWrapper = styled.View`
  margin-left: 20px;
`;

const NoResultText = styled.Text`
  padding: 12px;
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
  margin-left: 20px;
`;

const ButtonWrapper = styled.View``;

export default SpotLocationAdd;
