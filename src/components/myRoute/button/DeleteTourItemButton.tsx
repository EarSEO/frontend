import { Animated } from "react-native";

import Button from "@/components/common/Button";

import { theme } from "@/styles/theme";

import { useMyRouteBottomSheetStore } from "@/store/useMyRouteBottomSheetStore";
import View = Animated.View;

const DeleteTourItemButton: React.FC = () => {
  const { setPreTour, applyDeleteList } = useMyRouteBottomSheetStore();
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
        text={"취소"}
        width={theme.spacing.xl * 2}
        onPress={() => setPreTour()}
      />
      <View style={{ flex: 1 }}>
        <Button
          text={"삭제"}
          onPress={() => {
            applyDeleteList();
            setPreTour();
          }}
        />
      </View>
    </View>
  );
};

export default DeleteTourItemButton;
