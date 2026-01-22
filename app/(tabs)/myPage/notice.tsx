import { styled } from "styled-components/native";

export default function Notice() {
  return (
    <Container>
      <Title>공지사항</Title>
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
