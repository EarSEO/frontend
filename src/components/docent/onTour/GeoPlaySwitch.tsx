import { Animated, Switch, Text } from "react-native";

import { theme } from "@/styles/theme";
import View = Animated.View;
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";

const GeoPlaySwitch: React.FC = () => {
  const geoPlay = useAudioPlayerStore((state) => state.geoPlay);
  const { setGeoPlay } = useAudioPlayerStore();
  const text1 = "위치기반";
  const text2 = "자동재생";
  return (
    <View
      style={{
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: theme.borderRadius.lg,
        borderColor: theme.colors.background.background500,
        backgroundColor: theme.colors.background.background400,
        padding: theme.spacing.sm,
        marginRight: theme.spacing.md,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Text
          style={{
            color: theme.colors.main.primary400,
            fontSize: theme.typography.fontSize.sm,
            fontFamily: theme.typography.fontFamily.regular,
          }}
        >
          {text1}
        </Text>
        <Text
          style={{
            color: theme.colors.main.primary400,
            fontSize: theme.typography.fontSize.sm,
            fontFamily: theme.typography.fontFamily.regular,
          }}
        >
          {text2}
        </Text>
      </View>
      <View style={{ paddingLeft: 10 }}>
        <Switch
          value={geoPlay}
          onValueChange={(checked) => {
            setGeoPlay(checked);
          }}
          trackColor={{
            false: theme.colors.alarm.error, // false => 안드로이드 백그라운드
            true: theme.colors.main.primary400,
          }}
          thumbColor={theme.colors.white}
          ios_backgroundColor={theme.colors.text.textWhite} // ios 백그라운드
          // ios_backgroundColor={theme.colors.alarm.error} // ios 백그라운드
          style={{ borderStyle: "solid", borderColor: "black", borderWidth: 1 }}
        />
      </View>
    </View>
  );
};

export default GeoPlaySwitch;
