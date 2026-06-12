import { styled } from "styled-components/native";

export default function Terms() {
  return (
    <Container>
      <Title>이용약관 및 정책</Title>
    </Container>
  );
}

const Container = styled.SafeAreaView`
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
