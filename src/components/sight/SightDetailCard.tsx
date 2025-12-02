import React from "react";

import { GestureResponderEvent } from "react-native";

import {
  Banknote,
  Clock,
  Headphones,
  Map,
  ParkingCircle,
  Phone,
} from "lucide-react-native";
import styled from "styled-components/native";

import { SightDetailCardProps } from "@/types/sight";

import AfterAddRoute from "@/assets/icons/afterAddRoute.svg";
import BeforeAddRoute from "@/assets/icons/beforeAddRoute.svg";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useRouteCartStore } from "@/store/useRouteCartStore";
import { normalizeHtmlBreaks } from "@/util/textNormalize";

const SightDetailCard: React.FC<SightDetailCardProps> = ({
  selectedSight,
  sightDetail,
  isDetailLoading,
  onClose,
}) => {
  const { insertRouteCartItem, removeRouteCartItem } = useRouteCartStore();
  const routeCartItems = useRouteCartStore((state) => state.routeCartItems);
  const listeningUrl = useAudioPlayerStore((state) => state.listeningUrl);
  const setListeningUrl = useAudioPlayerStore((state) => state.setListeningUrl);
  const player = useAudioPlayerStore((state) => state.player);

  const { playTrack, pause } = useAudioPlayerStore();

  const isMyDocentPlaying = listeningUrl === sightDetail?.docentUrl;

  const onPressDocent = (e: GestureResponderEvent) => {
    e.stopPropagation();

    if (!sightDetail?.docentUrl) return;
    if (isMyDocentPlaying) {
      player.pause();
      setListeningUrl("");
    } else {
      playTrack(sightDetail.docentUrl);
      setListeningUrl(sightDetail.docentUrl);
    }
  };

  if (!selectedSight) return null;

  const checkData = (data: string | undefined | null) => {
    const normalized = normalizeHtmlBreaks(data);
    return normalized && normalized.trim() !== ""
      ? normalized
      : "데이터가 존재하지 않습니다";
  };

  const isInCart =
    routeCartItems.filter((routeCartItem) => {
      return routeCartItem.sightId === selectedSight.id;
    }).length > 0;

  return (
    <Container>
      <HeaderRow>
        <SightTitle>{selectedSight.title}</SightTitle>

        {/* <IconButton onPress={(e) => {
          e.stopPropagation();
          isInCart ? removeRouteCartItem(selectedSight.id) : insertRouteCartItem({
            sightId : sightDetail?.id ?? "",
            theme : sightDetail?.theme ?? "",
            title : sightDetail?.title ?? "",
            address: sightDetail?.address ?? "",
            point: {
            longitude: sightDetail?.longitude ?? selectedSight.longitude,
            latitude: sightDetail?.latitude ?? selectedSight.latitude,
            },
            imageUrl: sightDetail?.imgUrl?? ""
          })
        }}>
          {isInCart ? (
            <AfterAddRoute width={28} height={28} />
          ) : (
            <BeforeAddRoute width={28} height={28} />
          )}
        </IconButton> */}

        <IconButton
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
        </IconButton>
      </HeaderRow>

      {isDetailLoading ? (
        <LoadingText>상세 정보 로딩 중...</LoadingText>
      ) : sightDetail ? (
        <>
          <BasicInfoRow>
            <SightDistance>{sightDetail.distance}km</SightDistance>
            <SightTheme>{sightDetail.theme}</SightTheme>
          </BasicInfoRow>
          <SightText>{checkData(sightDetail.address)}</SightText>

          <MainImage
            source={{
              uri: sightDetail.imgUrl || "https://via.placeholder.com/400",
            }}
            resizeMode="cover"
          />
          {sightDetail.docentUrl && (
            <DocentButton onPress={onPressDocent}>
              <Headphones
                size={20}
                color={isMyDocentPlaying ? "#1DB954" : "#333"}
              />
              <DocentText>
                {isMyDocentPlaying ? "일시정지" : "도슨트 듣기"}
              </DocentText>
            </DocentButton>
          )}

          <Section>
            <SectionTitle>소개</SectionTitle>
            <DescriptionText>{checkData(sightDetail.outl)}</DescriptionText>
          </Section>

          <Section>
            <SectionTitle>방문정보</SectionTitle>

            <InfoRow>
              <InfoLabelArea>
                <Map size={18} color="#666" />
                <InfoLabel>주소</InfoLabel>
              </InfoLabelArea>
              <InfoValue>{checkData(sightDetail.fullAddress)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Clock size={18} color="#666" />
                <InfoLabel>운영시간</InfoLabel>
              </InfoLabelArea>
              <InfoValue>{checkData(sightDetail.useTime)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Clock size={18} color="#666" />
                <InfoLabel>휴무일</InfoLabel>
              </InfoLabelArea>
              <InfoValue>{checkData(sightDetail.restDate)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Phone size={18} color="#666" />
                <InfoLabel>전화번호</InfoLabel>
              </InfoLabelArea>
              <InfoValue>{checkData(sightDetail.tel)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Banknote size={18} color="#666" />
                <InfoLabel>입장료</InfoLabel>
              </InfoLabelArea>
              <InfoValue>{checkData(sightDetail.useFee)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <ParkingCircle size={18} color="#666" />
                <InfoLabel>주차 가능</InfoLabel>
              </InfoLabelArea>

              {sightDetail.parking ? (
                <Badge
                  type={sightDetail.parking.includes("불가") ? "bad" : "good"}
                >
                  <BadgeText>
                    {sightDetail.parking.includes("불가") ? "불가" : "가능"}
                  </BadgeText>
                </Badge>
              ) : (
                <InfoValue>데이터가 존재하지 않습니다</InfoValue>
              )}
            </InfoRow>
          </Section>
        </>
      ) : null}

      <CloseButton onPress={onClose}>
        <CloseButtonText>닫기</CloseButtonText>
      </CloseButton>
    </Container>
  );
};

export default SightDetailCard;

const Container = styled.View`
  gap: 8px;
  padding-horizontal: 10px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
  padding: 4px;
`;

const SightTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  flex: 1;
`;

const BasicInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const SightDistance = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.main.primary};
`;

const SightTheme = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.textTertiary};
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  margin-top: 16px;
  margin-bottom: 16px;
`;

const SightText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const LoadingText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textTertiary};
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.grey.neutral100};
  border-radius: 8px;
  align-items: center;
`;

const CloseButtonText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
`;

const MainImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 0;
`;

const DocentButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 24px;
  margin-bottom: 24px;
  gap: 8px;
`;

const DocentText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const InfoLabelArea = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: #666;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: #000;
  font-weight: 500;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const Badge = styled.View<{ type: "good" | "bad" }>`
  padding: 4px 10px;
  border-radius: 4px;
  background-color: ${({ type }) => (type === "good" ? "#66BB6A" : "#EF5350")};
`;

const BadgeText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

const DescriptionText = styled.Text`
  font-size: 14px;
  color: #444;
  line-height: 22px;
`;
