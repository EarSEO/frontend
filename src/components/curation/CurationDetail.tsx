import { useCallback, useEffect } from "react";

import { LatLng } from "react-native-maps";

import styled from "styled-components/native";

import { useCurationDetail } from "@/hooks/sight/useCurationDetail";
import { useLocation } from "@/hooks/useLocation";
import { useRequireLogin } from "@/hooks/useRequireLogin";

import { CurationSightList, SightInfo } from "@/types/sight";

import { theme } from "@/styles/theme";

import { useRouteCartStore } from "@/store/route/useRouteCartStore";
import { useHeaderButtonStore } from "@/store/useHeaderButtonStore";
import { useLocationStore } from "@/store/useLocationStore";

import HeaderButton from "../common/HeaderButton";
import SightCard from "../common/SightCard";

type CurationDetailProps = {
  curationSightList: CurationSightList[];
  selectedCurationTitle: string | undefined;
  selectedCurationDescription: string | undefined;
  handleCardPress?: (
    sight: SightInfo,
    currentLocation: { longitude: number; latitude: number }
  ) => void;
  handleHeaderBackPress: () => void;
  handleHeaderClosePress?: () => void;
};

const CurationDetail: React.FC<CurationDetailProps> = ({
  curationSightList,
  selectedCurationTitle,
  selectedCurationDescription,
  handleCardPress,
  handleHeaderBackPress,
}) => {
  const {
    setButtonStyle,
    setShowBackButton,
    setShowCloseButton,
    setOnBackPress,
  } = useHeaderButtonStore();
  const { isInCart } = useCurationDetail();
  const { insertRouteCartItem, removeRouteCartItem } = useRouteCartStore();
  const location = useLocationStore((state) => state.location);
  const requireLogin = useRequireLogin();

  //헤더 렌더링
  useEffect(() => {
    setButtonStyle("NONE");
    setShowBackButton(true);
    setShowCloseButton(false);
    setOnBackPress(() => {
      handleHeaderBackPress();
    });
  }, [setShowBackButton, setShowCloseButton, handleHeaderBackPress]);

  //나의 경로에 sight 추가하는 핸들러
  const handleAddSightToMy = useCallback(
    (
      sightId: string,
      sightTitle: string,
      sightTheme: string,
      sightAddress: string,
      sightImage: string,
      sightLocation: LatLng
    ) => {
      const AddCartSight = {
        sightId: sightId,
        title: sightTitle,
        theme: sightTheme,
        address: sightAddress,
        point: {
          longitude: sightLocation.longitude,
          latitude: sightLocation.latitude,
        },
        imageUrl: sightImage,
      };

      if (isInCart(sightId)) {
        removeRouteCartItem(sightId);
      } else {
        insertRouteCartItem(AddCartSight);
      }
    },
    [insertRouteCartItem, location, isInCart]
  );

  //sight 클릭 시 관광지 상세로 이동하는 핸들러
  const handleMoveToSightDetail = useCallback(
    (
      sightId: string,
      sightTitle: string,
      sightGeohash: string,
      sightLocation: LatLng
    ) => {
      const sight = {
        id: sightId,
        title: sightTitle,
        longitude: sightLocation.longitude,
        latitude: sightLocation.latitude,
        geoHash: sightGeohash,
      };
      handleCardPress?.(sight, {
        longitude: location.longitude,
        latitude: location.latitude,
      });
    },
    [handleCardPress, location]
  );

  return (
    <Container>
      <HeaderContainer>
        <HeaderButton />
      </HeaderContainer>

      <TitleContainer>
        <CurationTitle>{selectedCurationTitle}</CurationTitle>
        <CurationDescription>{selectedCurationDescription}</CurationDescription>
      </TitleContainer>

      <SightListContainer>
        {curationSightList.map((sight) => (
          <SightCard
            key={sight.sightId}
            sightName={sight.title}
            sightTheme={sight.subTheme}
            distance={sight.distance}
            address={sight.address}
            iconStyle={"ADD"}
            image={sight.imgUrl}
            iconColor={
              isInCart(sight.sightId)
                ? theme.colors.main.primary
                : theme.colors.black
            }
            onIconPress={() => {
              if (!requireLogin()) return;
              handleAddSightToMy(
                sight.sightId,
                sight.title,
                sight.subTheme,
                sight.address,
                sight.imgUrl,
                sight.point
              );
            }}
            onCardPress={() =>
              handleMoveToSightDetail(
                sight.sightId,
                sight.title,
                sight.geoHash,
                sight.point
              )
            }
          />
        ))}
      </SightListContainer>
    </Container>
  );
};

export default CurationDetail;

const Container = styled.View``;

const HeaderContainer = styled.View`
  margin-bottom: 60px;
`;

const TitleContainer = styled.View`
  gap: 5px;
  margin: 5px 20px;
`;

const CurationTitle = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  color: ${({ theme }) => theme.colors.text.textPrimary};
`;

const CurationDescription = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
  margin-bottom: 10px;
`;

const SightListContainer = styled.View`
  align-items: center;
  margin-bottom: 80px;
`;
