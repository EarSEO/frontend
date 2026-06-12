import { Animated, Pressable, StyleProp, Text, ViewStyle } from "react-native";

import { useAudioPlayerStatus } from "expo-audio";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/docent/useAudioPlayerStore";
import View = Animated.View;

interface AudioProgressBar {
  weight: number;
  style?: StyleProp<ViewStyle>;
}

const AudioProgressBar: React.FC<AudioProgressBar> = ({ weight, style }) => {
  const { player, calSecToString } = useAudioPlayerStore();
  const status = useAudioPlayerStatus(player);
  const progress =
    status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;
  return (
    <Pressable style={style}>
      <View
        style={{
          backgroundColor: theme.colors.main.primary400,
          height: weight,
          borderRadius: weight / 2,
          width: `${progress}%`,
          zIndex: 11,
          position: "absolute",
        }}
      />
      <View
        style={{
          backgroundColor: theme.colors.white,
          height: weight,
          borderRadius: weight / 2,
          width: "100%",
          zIndex: 10,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: theme.spacing.xs,
        }}
      >
        <Text
          style={{
            color: theme.colors.text.textTertiary,
            fontFamily: theme.typography.fontFamily.regular,
          }}
        >
          {calSecToString(status.currentTime)}
        </Text>
        <Text
          style={{
            color: theme.colors.text.textTertiary,
            fontFamily: theme.typography.fontFamily.regular,
          }}
        >
          {calSecToString(status.duration)}
        </Text>
      </View>
    </Pressable>
  );
};

export default AudioProgressBar;
