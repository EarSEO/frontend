import { ChevronRight, CircleCheck, ListPlus, Menu } from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";
import { DEFAULT_IMAGE_URL } from "@/assets/images/defaultImage";

import AddressLabel from "./AddressLabel";

export type iconStyle = null | "EDIT" | "CHECK" | "ADD" | "DETAIL";

interface SightCardProps {
  image?: string;
  sightName: string;
  sightTheme: string;
  iconStyle?: iconStyle;
  iconColor?: string;
  distance?: number;
  address?: string;
  onCardPress?: () => void;
  onIconPress?: () => void;
  children?: React.ReactNode;
}

/**
 * @param onCardPress
 * @param onCardPress로 카드랑 icon 구분가능
 *
 * @param iconStyle 로 icon 선택 가능
 *
 * @children <AddressLabel> 넣어서 활용하세옹
 */

const SightCard: React.FC<SightCardProps> = ({
  image,
  sightName,
  sightTheme,
  iconStyle,
  iconColor,
  distance,
  address,
  onCardPress,
  onIconPress,
  children = null,
}) => {
  const getIcon = () => {
    const iconProps = { color: iconColor, size: 24 };
    switch (iconStyle) {
      case "EDIT":
        return <Menu {...iconProps} />;
      case "CHECK":
        return <CircleCheck />;
      case "ADD":
        return <ListPlus {...iconProps} />;
      case "DETAIL":
        return <ChevronRight {...iconProps} />;
    }
  };
  const toHttps = (url?: string) =>
    url?.startsWith("http://") ? url.replace("http://", "https://") : url;
  return (
    <SightCardContainer onPress={onCardPress}>
      <SightImage source={{ uri: toHttps(image) ?? DEFAULT_IMAGE_URL }} />
      <ContentWrapper>
        <SightName numberOfLines={1} ellipsizeMode="tail">
          {sightName}
        </SightName>
        <SightTheme>{sightTheme}</SightTheme>
        {distance && address ? (
          <AddressLabel distance={distance} address={address} />
        ) : null}
        {children}
      </ContentWrapper>
      <IconWrapper onPress={onIconPress}>{getIcon()}</IconWrapper>
    </SightCardContainer>
  );
};

const SightCardContainer = styled.Pressable`
  font-family: ${theme.typography.fontFamily.regular};
  width: 345px;
  height: 100px;
  flex-direction: row;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.s}px;
  ${theme.shadows.sightList}

  padding : 12px;
  gap: 12px;
`;

const SightImage = styled.Image`
  width: 75px;
  height: 75px;
  border-radius: ${theme.borderRadius.md}px;
`;

const ContentWrapper = styled.View`
  flex: 1;
  gap: 8px;
  padding: 5px;
`;

const SightName = styled.Text`
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SightTheme = styled.Text`
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.text.textBlue};
`;

const IconWrapper = styled.Pressable`
  justify-content: center;
  align-items: center;
  margin: 8px;
`;

export default SightCard;
