import { MapPin } from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface AddressLabelProps {
  address: string;
  distance: number;
  iconSize?: number;
  fontSize?: number;
}

interface TextFontSizeProps {
  fontSize?: number;
}

const AddressLabel: React.FC<AddressLabelProps> = ({
  address,
  distance,
  iconSize = 16,
  fontSize,
}) => {
  const formatDistance = () => {
    if (distance < 1000) {
      return `${distance}M`;
    }
    const kilometers = (distance / 1000).toFixed(1);
    return `${kilometers}KM`;
  };

  return (
    <AddressLavelContainer>
      <MapPin size={iconSize} color={theme.colors.text.textPrimary} />
      <AddressSection>
        <Distance fontSize={fontSize}>{formatDistance()}</Distance>
        <Address fontSize={fontSize}>{address}</Address>
      </AddressSection>
    </AddressLavelContainer>
  );
};

const AddressLavelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

const AddressSection = styled.View`
  font-family: ${theme.typography.fontFamily.regular};
  flex-direction: row;
  gap: 2px;
`;

const Distance = styled.Text<TextFontSizeProps>`
  font-size: ${({ fontSize }) =>
    fontSize ? `${fontSize}px` : theme.typography.fontSize.xs};
  color: ${theme.colors.text.textSecondary};
`;

const Address = styled.Text<TextFontSizeProps>`
  font-size: ${({ fontSize }) =>
    fontSize ? `${fontSize}px` : theme.typography.fontSize.xs};
  color: ${theme.colors.text.textSecondary};
`;

export default AddressLabel;
