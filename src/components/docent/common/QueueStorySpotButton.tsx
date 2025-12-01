import { Animated, Pressable } from "react-native";

import { Feather } from "@expo/vector-icons";
import { MessageSquareHeart } from "lucide-react-native";

import { theme } from "@/styles/theme";

import { useRouteStore } from "@/store/useRouteStore";
import View = Animated.View;

export interface QueueStorySpotButtonProps {
  itemId: number;
  buttonPosition: QueueButtonPosition;
  routeItemIdx: number;
}

export type QueueButtonPosition = "LIST" | "MODAL";

const QueueStorySpotButton: React.FC<QueueStorySpotButtonProps> = ({
  itemId,
  buttonPosition,
  routeItemIdx,
}) => {
  const { routeItems, enQueueStorySpot, deQueueStorySpot } = useRouteStore();
  if (buttonPosition === "MODAL")
    return (
      <View style={{ marginHorizontal: theme.spacing.md }}>
        {buttonPosition === "MODAL" && (
          <MessageSquareHeart
            size={theme.spacing.lg}
            color={theme.colors.black}
          />
        )}
      </View>
    );
  return (
    <View style={{ marginHorizontal: theme.spacing.md }}>
      {routeItems?.at(routeItemIdx)?.isQueued && (
        <Pressable onPress={() => deQueueStorySpot(itemId)}>
          <Feather
            name="check-square"
            size={(theme.spacing.lg + theme.spacing.xl) / 2}
            color={theme.colors.alarm.success}
          />
        </Pressable>
      )}
      {!routeItems?.at(routeItemIdx)?.isQueued && (
        <Pressable onPress={() => enQueueStorySpot(itemId)}>
          <Feather
            name="plus-square"
            size={(theme.spacing.lg + theme.spacing.xl) / 2}
            color={theme.colors.main.primary400}
          />
        </Pressable>
      )}
    </View>
  );
};

export default QueueStorySpotButton;
