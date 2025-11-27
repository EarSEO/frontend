import { MapPin } from "lucide-react-native";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface AdressLabelProps {
  adress: string;
  distance: number;
  iconSize?: number;
  fontSize?: number;
}

const AdressLabel: React.FC<AdressLabelProps> = ({
  adress,
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
    <AdressLavelContainer>
      <MapPin
        size={iconSize}
        fontSize={fontSize}
        color={theme.colors.text.textPrimary}
      />
      <AdressSection>
        {formatDistance()}
        {"  "}
        {adress}
      </AdressSection>
    </AdressLavelContainer>
  );
};

const AdressLavelContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const AdressSection = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm};
`;

export default AdressLabel;
