import { Animated } from "react-native";

import styled from "styled-components/native";

import MiniPlayer from "@/components/docent/miniPlayer/MiniPlayer";
import DocentList from "@/components/docent/onTour/DocentList";
import GeoPlaySwitch from "@/components/docent/onTour/GeoPlaySwitch";

import { theme } from "@/styles/theme";

import { useRouteStore } from "@/store/useRouteStore";
import View = Animated.View;

const OnTour: React.FC = () => {
  const { getRouteTitle } = useRouteStore();
  return (
    <Container>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: theme.spacing.xl,
          }}
        >
          <Title
            style={{
              flex: 1,
              fontSize: theme.typography.fontSize.xl,
              fontFamily: theme.typography.fontFamily.bold,
              marginLeft: theme.spacing.md,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
            textBreakStrategy="highQuality" // 안드로이드
            lineBreakStrategyIOS="hangul-word" // iOS
          >
            {getRouteTitle()}
          </Title>
          <GeoPlaySwitch />
        </View>
        <DocentList />
      </View>
      <MiniPlayer />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: "center";
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;

export default OnTour;
