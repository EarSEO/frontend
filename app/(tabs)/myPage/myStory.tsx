import { useEffect, useRef, useState } from "react";

import { ActivityIndicator, FlatList } from "react-native";
import PagerView from "react-native-pager-view";

import styled from "styled-components/native";

import StoryCard from "@/components/story/StoryCard";

import { useLikedStory } from "@/hooks/story/useLikedStory";
import { useMyStory } from "@/hooks/story/useMyStory";

import { MyStoryItem } from "@/types/myStory";

import { theme } from "@/styles/theme";

import { useAuthStore } from "@/store/profile/useAuthStore";

type TabType = "myStory" | "liked";

export default function MyStory() {
  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState<TabType>("myStory");
  const myStories = useMyStory((s) => s.myStories);
  const hasNext = useMyStory((s) => s.hasNext);
  const isLoading = useMyStory((s) => s.isLoading);
  const fetchMyStories = useMyStory((s) => s.fetchMyStories);

  const likedStories = useLikedStory((s) => s.likedStories);
  const likedHasNext = useLikedStory((s) => s.hasNext);
  const likedIsLoading = useLikedStory((s) => s.isLoading);
  const fetchLikedStories = useLikedStory((s) => s.fetchLikedStories);
  const refreshLikedStories = useLikedStory((s) => s.refreshLikedStories);

  useEffect(() => {
    fetchMyStories(true);
    fetchLikedStories(true);
  }, []);

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    pagerRef.current?.setPage(tab === "myStory" ? 0 : 1);
  };

  const handlePageSelected = (e: { nativeEvent: { position: number } }) => {
    const position = e.nativeEvent.position;
    setActiveTab(position === 0 ? "myStory" : "liked");
  };

  const { user } = useAuthStore();

  return (
    <Container>
      {/* 헤더 영역 */}
      <HeaderPlaceholder />

      <TabContainer>
        <TabButton
          active={activeTab === "myStory"}
          onPress={() => handleTabPress("myStory")}
        >
          <TabText active={activeTab === "myStory"}>MY 이야기</TabText>
        </TabButton>
        <TabButton
          active={activeTab === "liked"}
          onPress={() => handleTabPress("liked")}
        >
          <TabText active={activeTab === "liked"}>내가 좋아요한 글</TabText>
        </TabButton>
      </TabContainer>

      <StyledPagerView
        ref={pagerRef}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <PageContainer key="1">
          <FlatList
            data={myStories}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(item) => item.storyId.toString()}
            refreshing={isLoading}
            onRefresh={() => fetchMyStories(true)}
            renderItem={({ item }) => (
              <StoryCard
                storyId={item.storyId}
                authorId={user?.memberId}
                profileUrl={item.storyAuthor?.profileUrl || user?.profileImage}
                userNickName={item.storyAuthor?.nickname}
                stroySpotName={item.title}
                storyConcept={item.storyConcept}
                content={item.content}
                imageUrls={item.imageUrls}
                likeCount={item.likeCount}
                isLiked={item.isLiked}
                createdAt={item.createdAt as string}
              />
            )}
            onEndReached={() => {
              if (hasNext && !isLoading) {
                fetchMyStories(false);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading ? <ActivityIndicator style={{ padding: 20 }} /> : null
            }
            ListEmptyComponent={
              !isLoading ? (
                <EmptyContainer>
                  <EmptyText>작성한 이야기가 없습니다</EmptyText>
                </EmptyContainer>
              ) : null
            }
          />
        </PageContainer>
        <PageContainer key="2">
          <FlatList
            data={likedStories}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(item) => item.storyId.toString()}
            refreshing={likedIsLoading}
            onRefresh={refreshLikedStories}
            renderItem={({ item }: { item: MyStoryItem }) => (
              <StoryCard
                storyId={item.storyId}
                authorId={user?.memberId}
                profileUrl={item.storyAuthor?.profileUrl}
                userNickName={item.storyAuthor?.nickname}
                stroySpotName={item.title}
                storyConcept={item.storyConcept}
                content={item.content}
                imageUrls={item.imageUrls}
                likeCount={item.likeCount}
                isLiked={item.isLiked}
                createdAt={item.createdAt as string}
              />
            )}
            onEndReached={() => {
              if (likedHasNext && !likedIsLoading) {
                fetchLikedStories(false);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              likedIsLoading ? (
                <ActivityIndicator style={{ padding: 20 }} />
              ) : null
            }
            ListEmptyComponent={
              !likedIsLoading ? (
                <EmptyContainer>
                  <EmptyText>좋아요한 글이 없습니다</EmptyText>
                </EmptyContainer>
              ) : null
            }
          />
        </PageContainer>
      </StyledPagerView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const HeaderPlaceholder = styled.View`
  height: 50px;
`;

const TabContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding-vertical: 12px;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${({ active }) =>
    active ? theme.colors.text.textPrimary : "transparent"};
`;

const TabText = styled.Text<{ active: boolean }>`
  font-family: ${({ active }) =>
    active
      ? theme.typography.fontFamily.semiBold
      : theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${({ active }) =>
    active ? theme.colors.text.textPrimary : theme.colors.text.textTertiary};
`;

const StyledPagerView = styled(PagerView)`
  flex: 1;
`;

const PageContainer = styled.View`
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
`;

const EmptyText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
`;
