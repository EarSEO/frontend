import { useCallback, useRef } from "react";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Button from "@/components/common/Button";

import { useRouteStore } from "@/store/useRouteStore";

export default function MyRoute() {
  const Ref = useRef<any>(null);
  const { setRoute, finishRoute } = useRouteStore();
  const onPressCreateMockRouteData = useCallback(() => {
    setRoute({ placeIds: [] });
  }, []);
  const onPressDeleteMockRouteData = useCallback(() => {
    finishRoute();
  }, []);
  return (
    <Container>
      <Title>지도</Title>
      <CustomBottomSheet bottomSheetRef={Ref}>
        <Title>나의 여행 경로 바텀시트</Title>
        <Button
          text="목데이터 만들기"
          onPress={() => onPressCreateMockRouteData()}
        ></Button>
        <Button
          text="목데이터 제거하기"
          onPress={() => onPressDeleteMockRouteData()}
        ></Button>
      </CustomBottomSheet>
    </Container>
  );
}

const Container = styled.View`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};

  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;
