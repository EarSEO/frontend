import { GestureResponderEvent, TouchableOpacity } from "react-native";

import SightDocentBriefInfo from "@/components/docent/common/SightDocentBriefInfo";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { RouteItem } from "@/store/useRouteStore";

export interface SightDocentCellProps {
  routeItem: RouteItem;
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
}

const SightDocentCell: React.FC<SightDocentCellProps> = ({
  routeItem,
  onPress,
  children,
}: SightDocentCellProps) => {
  const { listeningRouteItem } = useAudioPlayerStore();

  const isCurrentItem =
    listeningRouteItem?.itemId === routeItem.itemId &&
    listeningRouteItem.itemType === "SIGHT";

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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: backgroundColor,
        marginHorizontal: theme.spacing.md,
        marginVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        borderStyle: "solid",
        boxShadow: boxShadow,
      }}
    >
      <SightDocentBriefInfo
        sightImageUrl={routeItem.itemImageUrl}
        sightTitle={routeItem.itemName}
        itemTheme={routeItem.itemTheme}
      />
      {children}
    </TouchableOpacity>
  );
};

export default SightDocentCell;
