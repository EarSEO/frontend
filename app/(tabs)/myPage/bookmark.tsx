import { useCallback, useEffect, useState } from "react";

import { ActivityIndicator, FlatList } from "react-native";

import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import styled from "styled-components/native";

import SightCard from "@/components/common/SightCard";

import { useLocation } from "@/hooks/common/useLocation";
import { useBookmark } from "@/hooks/sight/useBookmark";

import { SightDetailInfo } from "@/types/sight";

import { theme } from "@/styles/theme";
import AfterAddBookmark from "@/assets/icons/afterAddBookmark.svg";
import BeforeAddBookmark from "@/assets/icons/beforeAddBookmark.svg";

import { getSightDetail } from "@/api/sight/getSight";
import { useBookmarkStore } from "@/store/common/useBookmarkStore";
import { useLocationStore } from "@/store/common/useLocationStore";
import { useSightStore } from "@/store/sight/useSightStore";

interface BookmarkSightItem {
  sightId: number;
  title: string;
  imgUrl: string;
  isBookmarked: boolean;
}

export default function Bookmark() {
  const router = useRouter();
  const location = useLocationStore((state) => state.location);
  const { userBookmarkList } = useBookmarkStore();
  const { fetchBookmark, removeBookmark } = useBookmark();

  const [bookmarkSights, setBookmarkSights] = useState<BookmarkSightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 북마크 목록의 각 sightId로 상세 정보 조회
  const fetchBookmarkSights = useCallback(async () => {
    const bookmarks = userBookmarkList?.bookmarks ?? [];
    if (bookmarks.length === 0) {
      setBookmarkSights([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await Promise.allSettled(
        bookmarks.map((b) =>
          getSightDetail({
            id: b.sightId,
            longitude: location.longitude,
            latitude: location.latitude,
          })
        )
      );

      const items: BookmarkSightItem[] = results
        .map((result, index) => {
          if (result.status === "fulfilled") {
            const detail: SightDetailInfo = result.value;
            return {
              sightId: bookmarks[index].sightId,
              title: detail.title,
              imgUrl: detail.imgUrl,
              isBookmarked: true,
            };
          }
          return null;
        })
        .filter((item): item is BookmarkSightItem => item !== null);

      setBookmarkSights(items);
    } catch (error) {
      console.error("북마크 관광지 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userBookmarkList, location.latitude, location.longitude]);

  useEffect(() => {
    fetchBookmark();
  }, []);

  useEffect(() => {
    if (userBookmarkList) {
      fetchBookmarkSights();
    }
  }, [userBookmarkList]);

  // 카드 누르면 메인 지도로 이동 후 해당 관광지 포커스
  const handleCardPress = (sightId: number) => {
    useSightStore.getState().setNavigateSightId(sightId);
    router.push("/(tabs)");
  };

  // 북마크 해제 시 리스트에서 즉시 제거
  const handleBookmarkRemove = async (sightId: number) => {
    try {
      await removeBookmark(sightId);
      setBookmarkSights((prev) => prev.filter((s) => s.sightId !== sightId));
    } catch (error) {
      console.error("북마크 삭제 실패:", error);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: BookmarkSightItem }) => (
      <CardWrapper>
        <SightCard
          image={item.imgUrl}
          sightName={item.title}
          sightTheme="관광지"
          iconStyle={null}
          onCardPress={() => handleCardPress(item.sightId)}
        />
        <BookmarkIcon
          onPress={() => handleBookmarkRemove(item.sightId)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AfterAddBookmark width={28} height={28} />
        </BookmarkIcon>
      </CardWrapper>
    ),
    [bookmarkSights]
  );

  if (isLoading && bookmarkSights.length === 0) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
          </BackButton>
          <HeaderTitle>북마크</HeaderTitle>
          <HeaderSpacer />
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.main.primary} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
        </BackButton>
        <HeaderTitle>북마크</HeaderTitle>
        <HeaderSpacer />
      </Header>

      <FlatList
        data={bookmarkSights}
        keyExtractor={(item) => String(item.sightId)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, gap: 12, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyContainer>
            <EmptyText>북마크한 관광지가 없습니다</EmptyText>
          </EmptyContainer>
        }
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Header = styled.View`
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: flex-start;
`;

const HeaderTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.text.textPrimary};
`;

const HeaderSpacer = styled.View`
  width: 40px;
`;

const CardWrapper = styled.View`
  align-items: center;
`;

const BookmarkIcon = styled.Pressable`
  position: absolute;
  right: 24px;
  top: 50%;
  margin-top: -14px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
`;
