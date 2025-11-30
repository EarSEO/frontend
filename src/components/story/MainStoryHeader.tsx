import styled from "styled-components/native";

import Divider from "./Divider";

const MainStoryHeader = () => {
  return (
    <HeaderContainer>
      <ContentWrapper>
        <Title>잼애 듣고싶나요??</Title>
        <SubTitle>근처에 재밌는 얘기를 확인해보세요.</SubTitle>
      </ContentWrapper>
      <Divider />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View``;

const ContentWrapper = styled.View`
  gap: 5px;
  margin-left: 20px;
  margin-right: 20px;
`;

const Title = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

export default MainStoryHeader;
