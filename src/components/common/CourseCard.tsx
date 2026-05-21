import { ImageBackground } from "react-native";

import styled from "styled-components/native";

import { theme } from "@/styles/theme";
import { DEFAULT_IMAGE_URL } from "@/assets/images/defaultImage";

interface CourseCardProps {
  image: string;
  courseTitle: string;
  courseSubTitle: string;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  courseTitle,
  courseSubTitle,
  onPress,
}) => {
  return (
    <CourseCardContainer onPress={onPress}>
      <BackgroundImage
        imageStyle={{ borderRadius: theme.borderRadius.lg }}
        source={{ uri: image ?? DEFAULT_IMAGE_URL }}
      >
        <ContentWrapper>
          <Title>{courseTitle}</Title>
          <SubTitle>{courseSubTitle}</SubTitle>
        </ContentWrapper>
      </BackgroundImage>
    </CourseCardContainer>
  );
};

const CourseCardContainer = styled.Pressable`
  border-radius: ${theme.borderRadius.lg}px;
  margin: 10px;

  width: 358px;
  height: 120px;
`;

const BackgroundImage = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.lg}px;
  justify-content: flex-end;
`;

const ContentWrapper = styled.View`
  color: ${theme.colors.text.textPrimary};
  gap: 3px;
  padding: 16px 20px;
`;

const Title = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  font-family: ${theme.typography.fontFamily.semiBold};
  color: ${theme.colors.text.textWhite};
`;

const SubTitle = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  font-family: ${theme.typography.fontFamily.medium};
  color: ${theme.colors.text.textWhite};
`;

export default CourseCard;
