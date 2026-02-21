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

import { SightDetailInfo } from "@/types/sight";

import { theme } from "@/styles/theme";

import {
  sightToCustomAudioMetadata,
  useAudioPlayerStore,
} from "@/store/useAudioPlayerStore";
import { normalizeHtmlBreaks } from "@/util/textNormalize";

import Divider from "../story/Divider";

interface SightInfo {
  isDetailLoading: boolean;
  sightDetail: SightDetailInfo | null;
}

const SightInfo: React.FC<SightInfo> = ({ isDetailLoading, sightDetail }) => {
  const checkData = (data: string | undefined | null) => {
    const normalized = normalizeHtmlBreaks(data);
    return normalized && normalized.trim() !== ""
      ? normalized
      : "데이터가 존재하지 않습니다";
  };
  const audioMetadata = useAudioPlayerStore((state) => state.audioMetadata);
  const setTemporarySightInfo = useAudioPlayerStore(
    (state) => state.setTemporarySightInfo
  );
  const isMyDocentPlaying =
    sightDetail !== null &&
    audioMetadata?.id === sightToCustomAudioMetadata(sightDetail).id;

  const onPressDocent = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (!sightDetail?.docentUrl) return;
    if (isMyDocentPlaying) {
      setTemporarySightInfo();
    } else {
      setTemporarySightInfo(sightDetail);
    }
  };

  return (
    <Container>
      <SightDocentWrapper>
        {sightDetail?.docentUrl && (
          <DocentButton onPress={onPressDocent}>
            <Headphones
              size={20}
              color={
                isMyDocentPlaying
                  ? theme.colors.alarm.success
                  : theme.colors.grey.neutral600
              }
            />
            <DocentText>
              {isMyDocentPlaying ? "일시정지" : "도슨트 듣기"}
            </DocentText>
          </DocentButton>
        )}
      </SightDocentWrapper>

      {isDetailLoading ? (
        <LoadingText>상세 정보 로딩 중...</LoadingText>
      ) : sightDetail ? (
        <SightDeatilContainer>
          <SightInfoWrapper>
            <SectionTitle>소개</SectionTitle>
            <DescriptionText>{checkData(sightDetail.overview)}</DescriptionText>
          </SightInfoWrapper>
          <Divider />

          <VisitorInfoWrapper>
            <SectionTitle>방문정보</SectionTitle>

            <InfoRow>
              <InfoLabelArea>
                <Map size={18} color="#666" />
                <InfoLabel>주소</InfoLabel>
              </InfoLabelArea>
              <InfoTextArea>
                <InfoValue>{checkData(sightDetail.fullAddress)}</InfoValue>
              </InfoTextArea>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Clock size={18} color="#666" />
                <InfoLabel>운영시간</InfoLabel>
              </InfoLabelArea>
              <InfoTextArea>
                <InfoValue>{checkData(sightDetail.useTime)}</InfoValue>
              </InfoTextArea>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Clock size={18} color="#666" />
                <InfoLabel>휴무일</InfoLabel>
              </InfoLabelArea>
              <InfoTextArea>
                <InfoValue>{checkData(sightDetail.restDate)}</InfoValue>
              </InfoTextArea>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Phone size={18} color="#666" />
                <InfoLabel>전화번호</InfoLabel>
              </InfoLabelArea>
              <InfoTextArea>
                <InfoValue>{checkData(sightDetail.tel)}</InfoValue>
              </InfoTextArea>
            </InfoRow>

            <InfoRow>
              <InfoLabelArea>
                <Banknote size={18} color="#666" />
                <InfoLabel>입장료</InfoLabel>
              </InfoLabelArea>
              <InfoTextArea>
                <InfoValue>{checkData(sightDetail.useFee)}</InfoValue>
              </InfoTextArea>
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
          </VisitorInfoWrapper>
        </SightDeatilContainer>
      ) : null}
    </Container>
  );
};

const Container = styled.ScrollView``;

const SightDeatilContainer = styled.View``;

const DocentText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const SightDocentWrapper = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 12px;
`;

const SightInfoWrapper = styled.View`
  margin-left: 16px;
  margin-right: 16px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  margin-top: 8px;
  margin-bottom: 20px;
`;

const DescriptionText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: #444;
  line-height: 22px;
`;

const LoadingText = styled.Text``;

const VisitorInfoWrapper = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 30px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const InfoLabelArea = styled.View`
  flex-direction: row;
  gap: 8px;
  padding: 1px;
`;

const InfoLabel = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

const InfoTextArea = styled.View`
  width: 270px;
`;

const InfoValue = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Badge = styled.View<{ type: "good" | "bad" }>`
  padding: 4px 10px;
  border-radius: 4px;
  background-color: ${({ type }) =>
    type === "good" ? theme.colors.alarm.success : theme.colors.alarm.error};
`;

const BadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.text.textWhite};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const DocentButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.background300};
  padding: 12px;
  border-radius: 24px;
  margin-bottom: 24px;
  gap: 10px;
`;

export default SightInfo;
