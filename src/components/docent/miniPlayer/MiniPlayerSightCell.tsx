import { Animated } from "react-native";

import SightDocentBriefInfo from "@/components/docent/common/SightDocentBriefInfo";

import { theme } from "@/styles/theme";

import { RouteItem } from "@/store/useRouteStore";
import View = Animated.View;

export interface MiniPlayerModalDocentCellProps {
  routeItem: RouteItem;
  children: React.ReactNode;
}

const MiniPlayerSightCell: React.FC<MiniPlayerModalDocentCellProps> = ({
  routeItem,
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.colors.background.background500,
        marginHorizontal: theme.spacing.md,
        marginVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        borderStyle: "solid",
        boxShadow: `0 0 13px 0.5px ${"#a8a8a8"}`,
      }}
    >
      <SightDocentBriefInfo
        sightImageUrl={routeItem.itemImageUrl}
        sightTitle={routeItem.itemName}
        itemTheme={routeItem.itemTheme}
      />
      {children}
    </View>
  );
};

export default MiniPlayerSightCell;
