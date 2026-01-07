import {
  Animated,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
} from "react-native";

import QueueStorySpotButton, {
  QueueButtonPosition,
} from "@/components/docent/common/QueueStorySpotButton";

import { theme } from "@/styles/theme";

import {
  routeItemToCustomAudioMetadata,
  useAudioPlayerStore,
} from "@/store/useAudioPlayerStore";
import { RouteItem } from "@/store/useRouteStore";
import View = Animated.View;

export interface StorySpotDocentCellProps {
  idx: number;
  routeItem: RouteItem;
  position: QueueButtonPosition;
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
}

const StorySpotDocentCell: React.FC<StorySpotDocentCellProps> = ({
  idx,
  routeItem,
  position,
  onPress,
  children,
}: StorySpotDocentCellProps) => {
  const audioMetadata = useAudioPlayerStore((state) => state.audioMetadata);

  const isCurrentItem =
    audioMetadata?.id === routeItemToCustomAudioMetadata(routeItem).id;

  const backgroundColor = isCurrentItem
    ? theme.colors.background.background500
    : theme.colors.background.background400;

  const boxShadow = isCurrentItem
    ? `0 0 13px 0.5px ${"rgba(17,114,255,0.25)"}`
    : `0 0 13px 0.5px ${"rgba(17,114,255,0.01)"}`;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: theme.spacing.md,
        marginVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.lg,
        borderStyle: "solid",
        boxShadow: boxShadow,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <QueueStorySpotButton
          itemId={routeItem.itemId}
          buttonPosition={position}
          routeItemIdx={idx}
        />
        <Text
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          {routeItem.itemName}
        </Text>
      </View>
      {children}
    </TouchableOpacity>
  );
};

export default StorySpotDocentCell;
