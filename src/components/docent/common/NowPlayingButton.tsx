import { useCallback, useMemo } from "react";

import { GestureResponderEvent, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayerStatus } from "expo-audio";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { RouteItem, useRouteStore } from "@/store/useRouteStore";

type ButtonIcon = "PAUSE" | "PLAY" | "MUSICAL_NOTES";
export type PlayButtonPosition = "LIST" | "MINI_PLAYER";

export interface NowPlayingButtonProps {
  routeItem: RouteItem;
  buttonPosition: PlayButtonPosition;
}

const pressedBackgroundColor = "#D0D8E3";

const NowPlayingButton: React.FC<NowPlayingButtonProps> = ({
  routeItem,
  buttonPosition,
}: NowPlayingButtonProps) => {
  const { player, pauseOrResume } = useAudioPlayerStore();
  const status = useAudioPlayerStatus(player);

  const { listeningRouteItem, setListeningRouteItem, pause, resume } =
    useAudioPlayerStore();
  const { routeItems } = useRouteStore();

  const isCurrentItem =
    listeningRouteItem?.itemId === routeItem.itemId &&
    listeningRouteItem.itemType === routeItem.itemType;
  const icon: ButtonIcon = useMemo(() => {
    if (!isCurrentItem) return "PLAY";
    if (buttonPosition === "LIST") return "MUSICAL_NOTES";
    return status.playing ? "PAUSE" : "PLAY";
  }, [isCurrentItem, buttonPosition, status.playing]);

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();

      if (buttonPosition === "LIST") {
        if (!isCurrentItem) {
          setListeningRouteItem(routeItem);
        }
      } else if (buttonPosition === "MINI_PLAYER") {
        pauseOrResume();
      }
    },
    [
      buttonPosition,
      isCurrentItem,
      status.playing,
      pause,
      resume,
      setListeningRouteItem,
      routeItems,
    ],
  );

  if (!routeItems) return <></>;

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? pressedBackgroundColor
          : theme.colors.background.background50,
        height: 2 * theme.borderRadius.lg,
        width: 2 * theme.borderRadius.lg,
        borderRadius: theme.borderRadius.lg,
        justifyContent: "center",
        alignItems: "center",
      })}
      onPress={onPress}
    >
      {icon === "PAUSE" && (
        <Ionicons
          name="pause"
          size={2 * theme.borderRadius.md}
          color={theme.colors.black}
        />
      )}
      {icon === "PLAY" && (
        <Ionicons
          name="play"
          size={2 * theme.borderRadius.md}
          color={theme.colors.black}
        />
      )}
      {icon === "MUSICAL_NOTES" && (
        <Ionicons
          name="musical-notes"
          size={2 * theme.borderRadius.md}
          color={theme.colors.main.primary400}
        />
      )}
    </Pressable>
  );
};

export default NowPlayingButton;
