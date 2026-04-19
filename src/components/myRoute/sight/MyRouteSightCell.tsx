import React from "react";

import { Animated, Image, Text } from "react-native";

import { Feather } from "@expo/vector-icons";
import { getDistance } from "geolib";
import { MapPinPlusIcon } from "lucide-react-native";

import { theme } from "@/styles/theme";

import { useMyRouteBottomSheetStore } from "@/store/route/useMyRouteBottomSheetStore";
import { RouteCartItem } from "@/store/route/useRouteCartStore";
import { distanceToString } from "@/util/locationUtil";
import View = Animated.View;
import { useLocationStore } from "@/store/common/useLocationStore";

interface MyRouteSightCellProps {
  routeCartItem: RouteCartItem;
}

const MyRouteSightCell: React.FC<MyRouteSightCellProps> = ({
  routeCartItem,
}) => {
  const location = useLocationStore((state) => state.location);
  const distance = getDistance(
    { latitude: location.latitude, longitude: location.longitude },
    {
      latitude: routeCartItem.point.latitude,
      longitude: routeCartItem.point.longitude,
    }
  );
  const { addDeleteList, removeDeleteList } = useMyRouteBottomSheetStore();
  const isPreTourDelete = useMyRouteBottomSheetStore(
    (state) => state.isPreTourDelete
  );
  const deleteList = useMyRouteBottomSheetStore((state) => state.deleteList);
  const isChecked = deleteList.includes(routeCartItem.sightId);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 0.3,
        borderBottomColor: "#cdcdcf",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Image
          source={{
            uri: routeCartItem.imageUrl,
          }}
          style={{
            height: theme.spacing.xl + theme.spacing.lg,
            width: theme.spacing.xl + theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
          }}
        />
        <View
          style={{
            paddingLeft: theme.spacing.md,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontFamily: theme.typography.fontFamily.medium,
            }}
          >
            {routeCartItem.title}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.main.primary100,
            }}
          >
            {routeCartItem.theme}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MapPinPlusIcon size={theme.typography.fontSize.sm} />
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm,
                paddingHorizontal: theme.spacing.xs,
              }}
            >
              {distanceToString(distance)}
            </Text>
            <Text style={{ fontSize: theme.typography.fontSize.sm }}>
              {routeCartItem.address}
            </Text>
          </View>
        </View>
      </View>
      {isPreTourDelete ? (
        <Feather
          name="check-square"
          size={(theme.spacing.lg + theme.spacing.xl) / 2}
          color={
            isChecked
              ? theme.colors.main.primary400
              : theme.colors.text.textTertiary
          }
          onPress={(e) => {
            e.stopPropagation();
            if (isChecked) {
              removeDeleteList(routeCartItem.sightId);
            } else {
              addDeleteList(routeCartItem.sightId);
            }
          }}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default MyRouteSightCell;
