import { useCallback } from "react";

import { Animated, ScrollView, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";

import SightDocentCell from "@/components/docent/onTour/SightDocentCell";
import StorySpotDocentCell from "@/components/docent/onTour/StorySpotDocentCell";

import { RouteItemType } from "@/types/route";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useMiniPlayerStore } from "@/store/useMiniPlayerStore";
import { useRouteStore } from "@/store/useRouteStore";
import View = Animated.View;

const MiniPlayerModalQueueList: React.FC = () => {
  const { getQueuedItems } = useRouteStore();
  const { closeModal } = useMiniPlayerStore();
  const { setAudioMetadata } = useAudioPlayerStore();
  const router = useRouter();
  const onPress = useCallback(
    (itemType: RouteItemType, id: number) => {
      if (itemType === "SIGHT") {
        closeModal();
        router.push(`/?id=${id}`); //TODO 관광지 라우팅 협의 필요
      } else if (itemType === "STORY_SPOT") {
        closeModal();
        router.push(`/story?id=${id}`); //TODO 이야기 라우팅 협의 필요
      }
    },
    [router],
  );
  return (
    <ScrollView>
      {getQueuedItems().map((queuedItem, idx) => {
        if (queuedItem.itemType === "SIGHT")
          return (
            <SightDocentCell
              onPress={() => setAudioMetadata(queuedItem)}
              routeItem={queuedItem}
              key={idx}
            >
              <TouchableOpacity
                onPress={() => onPress(queuedItem.itemType, queuedItem.itemId)}
              >
                <ChevronRightIcon
                  size={2 * theme.borderRadius.md}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </SightDocentCell>
          );
        else if (queuedItem.itemType === "STORY_SPOT")
          return (
            <StorySpotDocentCell
              onPress={() => setAudioMetadata(queuedItem)}
              routeItem={queuedItem}
              position={"MODAL"}
              key={idx}
              idx={idx}
            >
              <View style={{ height: theme.spacing.xl }} />
              <TouchableOpacity
                onPress={() => onPress(queuedItem.itemType, queuedItem.itemId)}
              >
                <ChevronRightIcon
                  size={2 * theme.borderRadius.md}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </StorySpotDocentCell>
          );
      })}
    </ScrollView>
  );
};

export default MiniPlayerModalQueueList;
