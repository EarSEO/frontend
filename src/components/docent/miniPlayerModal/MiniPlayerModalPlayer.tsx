import { useCallback } from "react";

import { Animated, GestureResponderEvent, Pressable } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayerStatus } from "expo-audio";
import { LetterTextIcon } from "lucide-react-native";

import AudioProgressBar from "@/components/docent/miniPlayerModal/AudioProgressBar";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/docent/useAudioPlayerStore";
import { useMiniPlayerStore } from "@/store/docent/useMiniPlayerStore";
import View = Animated.View;

const MiniPlayerModalPlayer: React.FC = () => {
  const { player, replay, forward, pauseOrResume } = useAudioPlayerStore();
  const { toggleLyrics } = useMiniPlayerStore();
  const status = useAudioPlayerStatus(player);
  const onPressLyrics = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      toggleLyrics();
    },
    [toggleLyrics]
  );
  return (
    <View
      style={{
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.xs,
      }}
    >
      <AudioProgressBar
        weight={5}
        style={{ marginHorizontal: theme.spacing.lg }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name="replay-10"
          size={theme.spacing.xl}
          onPress={() => replay()}
        />
        <Pressable
          style={{
            backgroundColor: theme.colors.main.primary400,
            height: 2 * theme.borderRadius.xl,
            width: 2 * theme.borderRadius.xl,
            borderRadius: theme.borderRadius.xl,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: theme.spacing.lg,
          }}
          onPress={() => pauseOrResume()}
        >
          {status.playing ? (
            <MaterialIcons
              name="pause"
              size={theme.borderRadius.xl}
              color={theme.colors.white}
            />
          ) : (
            <MaterialIcons
              name="play-arrow"
              size={theme.borderRadius.xl}
              color={theme.colors.white}
            />
          )}
        </Pressable>
        <MaterialIcons
          name="forward-10"
          size={theme.spacing.xl}
          onPress={() => forward()}
        />
        <LetterTextIcon
          size={(theme.spacing.xl + theme.spacing.lg) / 2}
          style={{ position: "absolute", right: theme.spacing.xl }}
          onPress={onPressLyrics}
        />
      </View>
    </View>
  );
};
export default MiniPlayerModalPlayer;
