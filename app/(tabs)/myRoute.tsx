import styled from "styled-components/native";

export default function MyRoute() {
  return (
    <Container>
      <Title>지도</Title>
      <Title>나의 여행 바텀시트</Title>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: "center";
  align-items: "center";
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;
