import {
  Bookmark,
  MapPin,
  MessageSquareHeart,
  MessageSquareMore,
} from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { distanceToString } from "@/util/locationUtil";

export type LocationType = "SIGHT" | "STORY" | "HOT_SPOT" | "BOOKMARK";

export interface LocationLabelProps {
  locationType?: LocationType;
  locationTitle?: string;
  address?: string;
  distance?: number;
  locationtheme?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const LocationLabel: React.FC<LocationLabelProps> = ({
  locationType,
  locationTitle,
  address,
  distance,
  locationtheme,
  isSelected = false,
  onPress,
}) => {
  const onlyTitle = !address && !distance && !locationtheme;

  const getIconName = () => {
    const iconProps = { size: 20, color: theme.colors.text.textPrimary };
    switch (locationType) {
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
      <OnlyTitleContainer onPress={onPress} isSelected={isSelected}>
        {getIconName()}
        <LocationTitle>{locationTitle}</LocationTitle>
      </OnlyTitleContainer>
    );
  } else
    return (
      <LabelContainer onPress={onPress} isSelected={isSelected}>
        {getIconName()}
        <ContentWrapper>
          <TopRow>
            <LocationTitle>{locationTitle}</LocationTitle>
            <LocationTheme>{locationtheme}</LocationTheme>
          </TopRow>
          <BottomRow>
            <Address>{address}</Address>
            <Distance>
              {distance != null ? distanceToString(distance) : null}
            </Distance>
          </BottomRow>
        </ContentWrapper>
      </LabelContainer>
    );
};

const OnlyTitleContainer = styled.Pressable<{ isSelected: boolean }>`
  flex-direction: row;
  gap: 15px;
  width: 100%;
  padding: 10px;
  border-radius: ${theme.borderRadius.md}px;
  border-color: ${({ isSelected }) =>
    isSelected ? theme.colors.grey.neutral200 : "transparent"};
  border-width: ${({ isSelected }) => (isSelected ? "1px" : "0px")};
`;

const LabelContainer = styled.Pressable<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 15;
  width: 100%;
  padding: 10px;
  border-radius: ${theme.borderRadius.md}px;
  border-color: ${({ isSelected }) =>
    isSelected ? theme.colors.grey.neutral400 : "transparent"};
  border-width: ${({ isSelected }) => (isSelected ? "2px" : "0px")};
`;

const ContentWrapper = styled.View`
  gap: 5px;
  flex: 1;
`;

const TopRow = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const LocationTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.md}px;
`;

const LocationTheme = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
`;

const BottomRow = styled.View`
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

const Address = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  color: ${theme.colors.text.textSecondary};
  font-size: ${theme.typography.fontSize.sm}px;
`;

const Distance = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  color: ${theme.colors.text.textBlue};
  font-size: ${theme.typography.fontSize.sm}px;
`;

export default LocationLabel;
