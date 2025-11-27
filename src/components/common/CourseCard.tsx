import { theme } from "@/styles/theme";
import { ImageBackground } from "react-native";
import styled from "styled-components/native";

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
        source={{ uri: image }}
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
  gap: 5px;
  padding: 20px;
`;

const Title = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.lg};
  font-family: ${theme.typography.fontFamily.semiBold};
  color: ${theme.colors.text.textPrimary};
`;

const SubTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs};
  font-family: ${theme.typography.fontFamily.medium};
  color: ${theme.colors.text.textPrimary};
`;

export default CourseCard;
