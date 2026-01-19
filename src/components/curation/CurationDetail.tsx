import { useCallback } from "react";

import styled from "styled-components/native";

import { useLocation } from "@/hooks/useLocation";

import { CurationSightList, SightInfo } from "@/types/sight";

import SightCard from "../common/SightCard";

type CurationDetailProps = {
  curationSightList: CurationSightList[];
  selectedCurationTitle: string | undefined;
  selectedCurationDescription: string | undefined;
  handleCardPress?: (
    sight: SightInfo,
    currentLocation: { longitude: number; latitude: number }
  ) => void;
};

const CurationDetail: React.FC<CurationDetailProps> = ({
  curationSightList,
  selectedCurationTitle,
  selectedCurationDescription,
  handleCardPress,
}) => {
  const { location } = useLocation();
  //나의 경로에 sight 추가하는 핸들러
  const handleAddSightToMy = () => {};

  //sight 클릭 시 관광지 상세로 이동하는 핸들러
  const handleMoveToSightDetail = useCallback(
    (sightId: string, sightTitle: string) => {
      const sight = {
        id: sightId,
        title: sightTitle,
        longitude: location.longitude,
        latitude: location.latitude,
        geoHash: "ㅇ게뭐야",
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
      <TitleContainer>
        <CurationTitle>{selectedCurationTitle}</CurationTitle>
        <CurationDescription>{selectedCurationDescription}</CurationDescription>
      </TitleContainer>

      <SightListContainer>
        {curationSightList.map((sight) => (
          <SightCard
            key={sight.sightId}
            sightName={sight.title}
            sightTheme={sight.theme}
            distance={sight.distance}
            address={sight.address}
            iconStyle={"ADD"}
            onIconPress={handleAddSightToMy}
            onCardPress={() =>
              handleMoveToSightDetail(sight.sightId, sight.title)
            }
          />
        ))}
      </SightListContainer>
    </Container>
  );
};

export default CurationDetail;

const Container = styled.View`
  gap: 16px;
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
`;

const SightListContainer = styled.View`
  align-items: center;
  margin-bottom: 80px;
`;
