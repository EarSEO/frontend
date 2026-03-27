import React from "react";

import { Animated } from "react-native";

import MyRouteSightCell from "@/components/myRoute/sight/MyRouteSightCell";

import { useRouteCartStore } from "@/store/route/useRouteCartStore";
import View = Animated.View;

const MyRouteSightList: React.FC = () => {
  const { routeCartItems } = useRouteCartStore();

  return (
    <View>
      {routeCartItems.map((routeCartItem, idx) => (
        <MyRouteSightCell routeCartItem={routeCartItem} key={idx} />
      ))}
    </View>
  );
};

export default MyRouteSightList;
