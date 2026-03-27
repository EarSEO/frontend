import { useRef, useState } from "react";

import { View } from "react-native";

import { ChevronRight, MoreHorizontal } from "lucide-react-native";
import styled from "styled-components/native";

import { useMyStory } from "@/hooks/story/useMyStory";

import { theme } from "@/styles/theme";
import { DEFAULT_IMAGE_URL } from "@/assets/images/defaultImage";

import { useAuthStore } from "@/store/profile/useAuthStore";

import Heart from "./Heart";
import MoreMenuButton from "./MoreMenuButton";

interface StoryCardProps {
  storyId: number | undefined;
  profileUrl?: string;
  userNickName?: string;
  stroySpotName?: string;
  storyConcept?: string;
  content?: string;
  createdAt?: string;
  likeCount?: number;
  isLiked?: boolean;
  imageUrls?: string[];
  authorId?: number;
}

const StoryCard: React.FC<StoryCardProps> = ({
  storyId,
  profileUrl,
  userNickName,
  stroySpotName,
  storyConcept,
  content,
  createdAt,
  likeCount,
  isLiked,
  imageUrls,
  authorId,
}) => {
  const { isLogined } = useAuthStore();
  const [numberOfLines, setNumberOfLines] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleLike = useMyStory((s) => s.toggleLike);
  const isLoading = useMyStory((s) => s.isLoading);

  const moreButtonRef = useRef<View>(null);

  const handleTextToggle = () => {
    setIsExpanded((prev) => !prev);
    setNumberOfLines((prevLines) =>
      prevLines === 3 ? Number.MAX_SAFE_INTEGER : 3
    );
  };

  const handleMorePress = () => {
    setIsMenuVisible(true);
  };

  const handleEdit = () => {
    setIsMenuVisible(false);
  };

  const handleDelete = () => {
    setIsMenuVisible(false);
  };

  const handleComplaint = () => {
    setIsMenuVisible(true);
  };

  const getStoryConceptDisplay = (): string => {
    switch (storyConcept) {
      case "TIP":
        return "🍯 꿀팁";
      case "EXPERIENCE":
        return "✨ 경험담";
      case "CULTURE":
        return "🎨 문화";
      case "HISTORY":
        return "📚 역사";
      case "ETC":
        return "📌 기타";
      default:
        return "";
    }
  };

  return (
    <StyledStoryCard>
      <StyledContainer>
        <ImageContainer>
          <ProfileImage
            source={{ uri: profileUrl || DEFAULT_IMAGE_URL }}
          ></ProfileImage>
        </ImageContainer>
        <TextContainer>
          <ContentHeaderWrapper>
            <HeaderWrapper>
              <UserNickname>{userNickName}</UserNickname>

              {isLogined ? (
                <MoreMenuWrapper>
                  <MoreMenu ref={moreButtonRef} onPress={handleMorePress}>
                    <MoreHorizontal
                      size={26}
                      color={theme.colors.grey.neutral600}
                    />
                  </MoreMenu>
                  <MoreMenuButton
                    anchorRef={moreButtonRef}
                    visible={isMenuVisible}
                    onEdit={handleEdit}
                    onClose={() => setIsMenuVisible(false)}
                    onDelete={handleDelete}
                    onComplaint={handleComplaint}
                    authorId={authorId}
                  />
                </MoreMenuWrapper>
              ) : null}
            </HeaderWrapper>
            <SpotInfoWrapper>
              <StroySpotName>{stroySpotName}</StroySpotName>
              <ChevronRight size={18} />
              <StoryConcept>{getStoryConceptDisplay()}</StoryConcept>
            </SpotInfoWrapper>
          </ContentHeaderWrapper>

          <ContentWrapper>
            <TextSection>
              <Text
                numberOfLines={numberOfLines}
                ellipsizeMode="tail"
                onTextLayout={(e) => {
                  setShowButton(e.nativeEvent.lines.length >= 3);
                }}
              >
                {content}
              </Text>
              {showButton && (
                <MoreButton onPress={handleTextToggle}>
                  <MoreButtonText>
                    {isExpanded ? "접기" : "...더보기"}
                  </MoreButtonText>
                </MoreButton>
              )}
            </TextSection>
            <PostingImageWrapper>
              {imageUrls && imageUrls.length === 1 && (
                <PostingImageSection>
                  <SingleImage source={{ uri: imageUrls[0] }} />
                </PostingImageSection>
              )}
              {imageUrls && imageUrls?.length > 1 && (
                <PostingImageSection>
                  <ImageScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >
                    {imageUrls?.map((images) => (
                      <PostingImages key={images} source={{ uri: images }} />
                    ))}
                  </ImageScrollView>
                </PostingImageSection>
              )}
            </PostingImageWrapper>
          </ContentWrapper>
          <PostInfoWrapper>
            <HeartIconSection>
              {storyId ? (
                <Heart
                  storyId={storyId}
                  likeCount={likeCount ?? 0}
                  isLiked={!!isLiked}
                  onToggle={toggleLike}
                  disabled={isLoading}
                />
              ) : null}
            </HeartIconSection>
            <CreatedAtSection>{createdAt}</CreatedAtSection>
          </PostInfoWrapper>
        </TextContainer>
      </StyledContainer>
    </StyledStoryCard>
  );
};

const StyledStoryCard = styled.View`
  border-bottom-width: 1px;
  border-style: solid;
  border-color: ${theme.colors.grey.neutral200};
`;

const StyledContainer = styled.View`
  flex-direction: row;
  gap: 15px;
  margin: 20px;
  margin-left: 10px;
  margin-right: 10px;
`;

const ImageContainer = styled.View``;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 100px;
`;

const TextContainer = styled.View`
  gap: 20px;
  width: 350px;
`;

const ContentHeaderWrapper = styled.View`
  gap: 3px;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 300px;
`;

const UserNickname = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.md}px;
`;

const SpotInfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StroySpotName = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
`;

const StoryConcept = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
`;
const MoreMenuWrapper = styled.View``;
const MoreMenu = styled.Pressable``;

const ContentWrapper = styled.View`
  gap: 10px;
`;

const TextSection = styled.View`
  max-width: 300px;
`;

const MoreButton = styled.Pressable`
  margin-top: 5px;
`;

const MoreButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.grey.neutral500};
`;

const Text = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
`;

const PostingImageWrapper = styled.View`
  width: 100%;
`;

const PostingImageSection = styled.View`
  gap: 10px;
`;

const SingleImage = styled.Image`
  width: 250px;
  height: 187px;
  border-radius: ${theme.borderRadius.md}px;
`;

const ImageScrollView = styled.ScrollView``;

const PostingImages = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: ${theme.borderRadius.md}px;
  margin-right: 5px;
`;

const PostInfoWrapper = styled.View`
  justify-content: space-between;
  flex-direction: row;
  max-width: 300px;
`;

const HeartIconSection = styled.View``;

const CreatedAtSection = styled.Text`
  padding-top: 2px;
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
`;

export default StoryCard;
