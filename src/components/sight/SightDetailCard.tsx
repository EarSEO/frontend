import React, { useEffect, useRef, useState } from "react";

import PagerView from "react-native-pager-view";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import styled from "styled-components/native";

import { useRequireLogin } from "@/hooks/common/useRequireLogin";
import { useBookmark } from "@/hooks/sight/useBookmark";
import { useStoryAdd } from "@/hooks/story/useStoryAdd";
import { useStorySpotMap } from "@/hooks/story/useStorySpotMap";

import { SightDetailCardProps } from "@/types/sight";

import { theme } from "@/styles/theme";
import AfterAddBookmark from "@/assets/icons/afterAddBookmark.svg";
import AfterAddRoute from "@/assets/icons/afterAddRoute.svg";
import BeforeAddBookmark from "@/assets/icons/beforeAddBookmark.svg";
import BeforeAddRoute from "@/assets/icons/beforeAddRoute.svg";

import { useBookmarkStore } from "@/store/common/useBookmarkStore";
import { useBottomSheetStore } from "@/store/common/useBottomSheetStore";
import { useHeaderButtonStore } from "@/store/common/useHeaderButtonStore";
import { useRouteCartStore } from "@/store/route/useRouteCartStore";
import { useStoryAddStore } from "@/store/story/useStoryAddStore";

import AddressLabel from "../common/AddressLabel";
import HeaderButton from "../common/HeaderButton";
import { StoryAddButton } from "../story/StoryAddButton";
import SightDetail from "./SightInfo";
import SightStory from "./SightStory";

type TabType = "sightInfo" | "sightStory";

const SightDetailCard: React.FC<SightDetailCardProps> = ({
  selectedSight,
  sightDetail,
  isDetailLoading,
  handleHeaderBackPress,
  handleHeaderClosePress,
}) => {
  const pagerRef = useRef<PagerView>(null);
  const requireLogin = useRequireLogin();

  const { insertRouteCartItem, removeRouteCartItem } = useRouteCartStore();
  const routeCartItems = useRouteCartStore((state) => state.routeCartItems);
  const { fetchStorySpotId } = useStorySpotMap();
  const { userBookmarkList } = useBookmarkStore();

  const { insertBookmark, removeBookmark } = useBookmark();
  const {
    setButtonStyle,
    setShowBackButton,
    setShowCloseButton,
    setOnClosePress,
    setOnBackPress,
  } = useHeaderButtonStore();

  const [activeTab, setActiveTab] = useState<TabType>("sightInfo");
  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    pagerRef.current?.setPage(tab === "sightInfo" ? 0 : 1);
  };

  useEffect(() => {
    setButtonStyle("NONE");
    setShowBackButton(true);
    setShowCloseButton(true);
    setOnBackPress(handleHeaderBackPress);
    setOnClosePress(handleHeaderClosePress);
  }, [
    setShowBackButton,
    handleHeaderBackPress,
    handleHeaderClosePress,
    setOnClosePress,
  ]);

  const { handleStoryAddButton } = useStoryAdd();
  const storyAddStep = useStoryAddStore((state) => state.storyAddStep);

  const { setBottomSheetAbsoluteBottom } = useBottomSheetStore();

  useEffect(() => {
    const button =
      activeTab === "sightStory" ? (
        <AddButtonWrapper>
          <StoryAddButton onPressButton={handleStoryAddButton} />
        </AddButtonWrapper>
      ) : (
        <></>
      );
    setBottomSheetAbsoluteBottom(button);
    return () => {
      setBottomSheetAbsoluteBottom(undefined);
    };
  }, [activeTab]);

  //sight 조회 시 srotyId 저장
  useEffect(() => {
    if (!selectedSight) return;
    const sightLocation = {
      longitude: selectedSight.longitude,
      latitude: selectedSight.latitude,
    };
    fetchStorySpotId(sightLocation);
  }, [fetchStorySpotId, selectedSight?.latitude, selectedSight?.longitude]);

  const handlePageSelected = (e: { nativeEvent: { position: number } }) => {
    const position = e.nativeEvent.position;
    setActiveTab(position === 0 ? "sightInfo" : "sightStory");
  };

  if (!selectedSight) return null;

  const isBookmark =
    userBookmarkList?.bookmarks.some(
      (b) => b.sightId === selectedSight.sightId
    ) ?? false;

  const isInCart =
    routeCartItems.filter((routeCartItem) => {
      return routeCartItem.sightId === selectedSight.sightId;
    }).length > 0;

  return (
    <Container>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <HeaderButton />
        </HeaderContainer>

        <SightHeaderContainer>
          <SightTitle>{selectedSight.title}</SightTitle>
          <RouteAddButton
            onPress={(e) => {
              if (!requireLogin()) return;

              e.stopPropagation();
              if (isInCart) {
                removeRouteCartItem(selectedSight.sightId);
              } else {
                insertRouteCartItem({
                  sightId: sightDetail?.id ?? selectedSight.sightId,
                  theme: sightDetail?.theme ?? "",
                  title: sightDetail?.title ?? "",
                  address: sightDetail?.address ?? "",
                  point: {
                    longitude:
                      sightDetail?.longitude ?? selectedSight.longitude,
                    latitude: sightDetail?.latitude ?? selectedSight.latitude,
                  },
                  imageUrl: sightDetail?.imgUrl ?? "",
                });
              }
            }}
          >
            {isInCart ? (
              <AfterAddRoute width={28} height={28} />
            ) : (
              <BeforeAddRoute width={28} height={28} />
            )}
          </RouteAddButton>

          <BookMarkAddButton
            onPress={(e) => {
              e.stopPropagation();
              if (!requireLogin()) return;

              if (isBookmark) {
                removeBookmark(selectedSight.sightId);
              } else {
                insertBookmark(selectedSight.sightId);
              }
            }}
          >
            {isBookmark ? (
              <AfterAddBookmark width={28} height={28} />
            ) : (
              <BeforeAddBookmark width={28} height={28} />
            )}
          </BookMarkAddButton>
        </SightHeaderContainer>

        {isDetailLoading ? (
          <LoadingText>상세 정보 로딩 중...</LoadingText>
        ) : sightDetail ? (
          <SightTopInfoWrapper>
            <BasicInfoWrapper>
              <AddressLabel
                address={sightDetail.address}
                distance={sightDetail.distance}
                fontSize={theme.typography.fontSize.sm}
              />
              <SightTheme>{sightDetail.theme}</SightTheme>
            </BasicInfoWrapper>

            <SightImage
              source={{
                uri: sightDetail.imgUrl || "https://via.placeholder.com/400",
              }}
              resizeMode="cover"
            />
          </SightTopInfoWrapper>
        ) : null}
        <TabContainer>
          <TabButton
            active={activeTab === "sightInfo"}
            onPress={() => handleTabPress("sightInfo")}
          >
            <TabText active={activeTab === "sightInfo"}>정보</TabText>
          </TabButton>
          <TabButton
            active={activeTab === "sightStory"}
            onPress={() => handleTabPress("sightStory")}
          >
            <TabText active={activeTab === "sightStory"}>이야기</TabText>
          </TabButton>
        </TabContainer>

        <ContentContainer>
          {activeTab === "sightInfo" ? (
            <SightDetail
              isDetailLoading={isDetailLoading}
              sightDetail={sightDetail}
            />
          ) : (
            <>
              <SightStory />
              <StoryButtonWrapper></StoryButtonWrapper>
            </>
          )}
        </ContentContainer>
      </BottomSheetScrollView>
    </Container>
  );
};

export default SightDetailCard;

const Container = styled.View`
  gap: 12px;
  height: 100%;
`;

const HeaderContainer = styled.View`
  margin-bottom: 60px;
`;

const SightHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 16px;
  margin-right: 16px;
`;

const SightTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  flex: 1;
`;

const RouteAddButton = styled.TouchableOpacity`
  padding: 4px;
`;
const BookMarkAddButton = styled.TouchableOpacity`
  padding: 4px;
`;

const BasicInfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const SightTheme = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textTertiary};
`;

const SightTopInfoWrapper = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  gap: 16px;
`;

const LoadingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textTertiary};
  margin-left: 16px;
  margin-right: 16px;
`;

const SightImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  align-items: center;
  padding: 12px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ active }) =>
    active ? theme.colors.text.textPrimary : "transparent"};
`;

const TabContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
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

const ContentContainer = styled.View`
  flex: 1;
`;

const StoryButtonWrapper = styled.View`
  position: absolute;
  bottom: 150px;
  right: 30px;

  width: 24px;
  height: 24px;

  align-items: center;
`;

const AddButtonWrapper = styled.View`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;
