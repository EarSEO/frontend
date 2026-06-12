import { Animated } from "react-native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

import { useMyRouteBottomSheetStore } from "@/store/route/useMyRouteBottomSheetStore";
import View = Animated.View;

const PreTourButton: React.FC = () => {
  const { setOnTour, setPreTourDelete } = useMyRouteBottomSheetStore();
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        flexDirection: "row",
        gap: 8,
        position: "static",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Button
        text={"삭제"}
        width={theme.spacing.xl * 2}
        onPress={() => setPreTourDelete()}
      />
      <View style={{ flex: 1 }}>
        <Button text={"여행시작"} onPress={() => setOnTour()} />
      </View>
    </View>
  );
};

export default PreTourButton;
