import {
  Bookmark,
  MapPin,
  MessageSquareHeart,
  MessageSquareMore,
} from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

export type LocationInfo = "SIGHT" | "STORY" | "HOT_SPOT" | "BOOKMARK";

export interface LocationLabelProps {
  locationInfo: LocationInfo;
  locationTitle: string;
  address?: string;
  distance?: number | null;
  locationthema?: string;
}

const LocationLabel: React.FC<LocationLabelProps> = ({
  locationInfo,
  locationTitle,
  address,
  distance,
  locationthema,
}) => {
  const onlyTitle = !address && !distance && !locationthema;

  const formatDistance = () => {
    if (!distance) {
      return "";
    }
    if (distance < 1000) {
      return `${distance}M`;
    }
    const kilometers = (distance / 1000).toFixed(1);
    return `${kilometers}KM`;
  };

  const getIconName = () => {
    const iconProps = { size: 20, color: theme.colors.text.textPrimary };
    switch (locationInfo) {
      case "BOOKMARK":
        return <Bookmark {...iconProps} />;
      case "SIGHT":
        return <MapPin {...iconProps} />;
      case "HOT_SPOT":
        return <MessageSquareHeart {...iconProps} />;
      case "STORY":
        return <MessageSquareMore {...iconProps} />;
    }
  };

  if (onlyTitle) {
    return (
      <OnlyTitleContainer>
        {getIconName()} <LocationTitle>{locationTitle}</LocationTitle>
      </OnlyTitleContainer>
    );
  } else
    return (
      <LabelContainer>
        {getIconName()}
        <ContentWrapper>
          <TopRow>
            <LocationTitle>{locationTitle}</LocationTitle>
            <LocationThema>{locationthema}</LocationThema>
          </TopRow>
          <BottomRow>
            <Address> {address}</Address>
            <Distance> {formatDistance()}</Distance>
          </BottomRow>
        </ContentWrapper>
      </LabelContainer>
    );
};

const OnlyTitleContainer = styled.View`
  flex-direction: row;
  gap: 15;
  width: 90%;
`;

const LabelContainer = styled.View`
  font-family: ${theme.typography.fontFamily.regular};
  flex-direction: row;
  align-items: center;
  gap: 15;
  width: 90%;
  margin: 10px;
`;

const ContentWrapper = styled.View`
  gap: 5;
  flex: 1;
`;

const TopRow = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const LocationTitle = styled.Text`
  font-size: ${theme.typography.fontSize.md};
`;

const LocationThema = styled.Text`
  font-size: ${theme.typography.fontSize.sm};
`;

const BottomRow = styled.View`
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

const Address = styled.Text`
  color: ${theme.colors.text.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const Distance = styled.Text`
  color: ${theme.colors.text.textBlue};
  font-size: ${theme.typography.fontSize.sm};
`;

export default LocationLabel;
