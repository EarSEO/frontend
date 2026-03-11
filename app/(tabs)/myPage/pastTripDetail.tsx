import { useEffect } from "react";

import { ActivityIndicator, FlatList } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MessageSquareHeart } from "lucide-react-native";
import styled from "styled-components/native";

import SightCard from "@/components/common/SightCard";

import { useCompletedRoute } from "@/hooks/route/useCompletedRoute";

import { CompletedRouteItem } from "@/types/completedRoute";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/story/useStoryStore";
import { useSightStore } from "@/store/useSightStore";

export default function PastTripDetail() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const {
    selectedRoute,
    selectedRouteItems,
    isDetailLoading,
    fetchRouteDetail,
    clearDetail,
  } = useCompletedRoute();

  const handleCardPress = (item: CompletedRouteItem) => {
    if (item.itemType === "SIGHT") {
      useSightStore.getState().setNavigateSightId(item.itemId);
      router.push("/(tabs)");
    } else {
      useStoryStore.getState().setNavigateStorySpotId(Number(item.itemId));
      router.push("/(tabs)/story");
    }
  };

  useEffect(() => {
    if (routeId) {
      fetchRouteDetail(Number(routeId));
    }

    return () => {
      clearDetail();
    };
  }, [routeId]);

  const renderItem = ({ item }: { item: CompletedRouteItem }) => {
    if (item.itemType === "SIGHT") {
      return (
        <CardWrapper>
          <SightCard
            image={item.itemImageUrl}
            sightName={item.itemName}
            sightTheme="관광지"
            iconStyle="DETAIL"
            iconColor={theme.colors.text.textSecondary}
            onCardPress={() => handleCardPress(item)}
          />
        </CardWrapper>
      );
    }

    return (
      <StorySpotItem onPress={() => handleCardPress(item)}>
        <MessageSquareHeart size={20} color={theme.colors.text.textSecondary} />
        <StorySpotText>{item.itemName}</StorySpotText>
      </StorySpotItem>
    );
  };

  if (isDetailLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.main.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
        </BackButton>
        <HeaderTitle numberOfLines={2} adjustsFontSizeToFit={false}>{selectedRoute?.name || "여행 상세"}</HeaderTitle>
        <HeaderSpacer />
      </Header>

      <FlatList
        data={selectedRouteItems}
        keyExtractor={(item, index) => `${item.itemType}-${item.itemId}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={
          <EmptyContainer>
            <EmptyText>방문한 장소가 없습니다</EmptyText>
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
  background-color: ${theme.colors.white};
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
  flex: 1;
  text-align: center;
`;

const HeaderSpacer = styled.View`
  width: 40px;
`;

const CardWrapper = styled.View`
  align-items: center;
`;

const EmptyContainer = styled.View`
  padding: 40px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
`;

const StorySpotItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
`;

const StorySpotText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textPrimary};
`;