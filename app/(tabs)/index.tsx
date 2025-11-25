import { useRef } from "react";

import styled from "styled-components/native";

import CustomBottomSheet from "@/components/bottomSheet/CustomBottomSheet";
import Input from "@/components/common/Input";
import { theme } from "@/styles/theme";

export default function Index() {
  const Ref = useRef<any>(null);

  return (
    <Container>
      <MapContainer>
        <InputWrapper>
          <Input
            backgroundColor={theme.colors.white}
            placeholderTextColor={theme.colors.text.textSecondary}
            placeholder="검색어를 입력하세요."
          />
        </InputWrapper>
      </MapContainer>
      <CustomBottomSheet bottomSheetRef={Ref}>
        <Title>큐레이션 바텀시트</Title>
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
const MapContainer = styled.View`
  flex: 1;
`;

const InputWrapper = styled.View`
  flex: 1;
  padding-top: 10;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;
