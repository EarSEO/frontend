import React from "react";

import styled from "styled-components/native";

import { SightDetailCardProps } from "@/types/sight";

import { theme } from "@/styles/theme";
import AfterAddRoute from "@/assets/icons/afterAddRoute.svg";
import BeforeAddRoute from "@/assets/icons/beforeAddRoute.svg";

import { useRouteCartStore } from "@/store/useRouteCartStore";

import AddressLabel from "../common/AddressLabel";
import SightInfo from "./SightInfo";

const SightDetailCard: React.FC<SightDetailCardProps> = ({
  selectedSight,
  sightDetail,
  isDetailLoading,
  onClose,
}) => {
  const { insertRouteCartItem, removeRouteCartItem } = useRouteCartStore();
  const routeCartItems = useRouteCartStore((state) => state.routeCartItems);

  if (!selectedSight) return null;

  const isInCart =
    routeCartItems.filter((routeCartItem) => {
      return routeCartItem.sightId === selectedSight.id;
    }).length > 0;

  return (
    <Container>
      <SightHeaderContainer>
        <SightTitle>{selectedSight.title}</SightTitle>
        <RouteAddButton
          onPress={(e) => {
            e.stopPropagation();
            if (isInCart) {
              removeRouteCartItem(String(selectedSight.id));
            } else {
              insertRouteCartItem({
                sightId: String(sightDetail?.id ?? selectedSight.id),
                theme: sightDetail?.theme ?? "",
                title: sightDetail?.title ?? "",
                address: sightDetail?.address ?? "",
                point: {
                  longitude: sightDetail?.longitude ?? selectedSight.longitude,
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
        <BookMarkAddButton></BookMarkAddButton>
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
      <SightInfo isDetailLoading={isDetailLoading} sightDetail={sightDetail} />
    </Container>
  );
};

export default SightDetailCard;

const Container = styled.View`
  gap: 12px;
  margin-bottom: 20px;
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
const BookMarkAddButton = styled.TouchableOpacity``;

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
`;

const SightImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
`;
