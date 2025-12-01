import { Animated } from "react-native";

import Button from "@/components/common/Button";

import { useLocation } from "@/hooks/useLocation";

import { theme } from "@/styles/theme";

import { useMyRouteBottomSheetStore } from "@/store/useMyRouteBottomSheetStore";
import View = Animated.View;

const PreTourButton: React.FC = () => {
  const { setOnTour, setPreTourDelete } = useMyRouteBottomSheetStore();
  const { location } = useLocation();
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
        <Button
          text={"여행시작"}
          onPress={() =>
            setOnTour({
              longitude: location.longitude,
              latitude: location.latitude,
            })
          }
        />
      </View>
    </View>
  );
};

export default PreTourButton;
