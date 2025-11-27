import styled from "styled-components/native";

export default function Username() {
  return (
    <Container>
      <Title>user</Title>
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
  color: ${({ theme }) => theme.colors.text.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;
