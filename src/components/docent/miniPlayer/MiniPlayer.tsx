import { useCallback, useState } from "react";

import { GestureResponderEvent, Text } from "react-native";

import styled from "styled-components/native";

import NowPlayingButton from "@/components/docent/common/NowPlayingButton";
import SightDocentBriefInfo from "@/components/docent/common/SightDocentBriefInfo";
import MiniPlayerModal from "@/components/docent/miniPlayerModal/MiniPlayerModal";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useMiniPlayerStore } from "@/store/useMiniPlayerStore";

const MiniPlayer: React.FC = () => {
  const [miniBarPressed, setMiniBarPressed] = useState<boolean>(false);
  const { toggleLyrics, enableModal, openModal } = useMiniPlayerStore();

  const onMiniBarPress = useCallback((e: GestureResponderEvent) => {
    toggleLyrics(false);
    openModal();
    setMiniBarPressed(false);
  }, []);
  const onMiniBarPressIn = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    setMiniBarPressed(true);
  }, []);
  const onMiniBarPressOut = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    setMiniBarPressed(false);
  }, []);

  const { listeningRouteItem } = useAudioPlayerStore();
  if (!listeningRouteItem) return <></>;

  if (enableModal) {
    return <MiniPlayerModal />;
  }
  return (
    <MiniPlayerContainer
      onPress={onMiniBarPress}
      onPressIn={onMiniBarPressIn}
      onPressOut={onMiniBarPressOut}
      pressed={miniBarPressed}
    >
      {listeningRouteItem.itemType === "SIGHT" ? (
        <SightDocentBriefInfo
          sightImageUrl={listeningRouteItem.itemImageUrl}
          sightTitle={listeningRouteItem.itemName}
          itemTheme={listeningRouteItem.itemTheme}
        />
      ) : (
        <Text
          style={{
            marginHorizontal: theme.spacing.md,
          }}
        >
          {listeningRouteItem.itemName}
        </Text>
      )}
      <NowPlayingButton
        routeItem={listeningRouteItem}
        buttonPosition="MINI_PLAYER"
      />
    </MiniPlayerContainer>
  );
};

const MiniPlayerContainer = styled.Pressable<{ pressed: boolean }>`
  background-color: ${(prop) =>
    prop.pressed
      ? theme.colors.grey.neutral300
      : theme.colors.background.background400};
  border-radius: ${theme.borderRadius.lg}px;
  margin: 10px 10px;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default MiniPlayer;
