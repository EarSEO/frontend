import { useRef } from "react";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";

export default function MyRoute() {
  const Ref = useRef<any>(null);

  return (
    <Container>
      <Title>지도</Title>
      <CustomBottomSheet bottomSheetRef={Ref}>
        <Title>나의 여행 경로 바텀시트</Title>
      </CustomBottomSheet>
    </Container>
  );
}

const Container = styled.View`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};

  flex: 1;
  justify-content: "center";
  align-items: "center";
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;
