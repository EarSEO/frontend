import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useStoryAddStore } from "@/store/story/useStoryAddStore";

import LocationLabel from "../../common/LocationLabel";

const SpotLocationAdd = () => {
  const pinAddress = useStoryAddStore((state) => state.pinAddress);
  const nameAddress = pinAddress?.name;

  return (
    <Container>
      <Content>
        {pinAddress ? (
          <LocationLabel spotType={"HOT_SPOT"} locationTitle={nameAddress} />
        ) : (
          <NoResultText>로딩 중 입니다...</NoResultText>
        )}
      </Content>
      <ButtonWrapper></ButtonWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
`;

const NoResultText = styled.Text`
  padding: 12px;
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textSecondary};
`;

const ButtonWrapper = styled.View``;

export default SpotLocationAdd;
