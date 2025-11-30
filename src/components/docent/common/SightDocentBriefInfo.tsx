import { Animated, Image, Text } from "react-native";

import { theme } from "@/styles/theme";
import View = Animated.View;

export interface SightDocentBriefInfoProps {
  sightImageUrl: string | undefined;
  sightTitle: string;
  itemTheme: string | undefined;
}

const defaultImageUrl =
  "https://cdn.earseo.click/common/image/defaultImage.png";

const SightDocentBriefInfo: React.FC<SightDocentBriefInfoProps> = ({
  sightImageUrl,
  itemTheme,
  sightTitle,
}) => {
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <Image
        source={{ uri: sightImageUrl ?? defaultImageUrl }}
        style={{ height: 50, width: 50, borderRadius: 10, marginRight: 10 }}
      />
      <View
        style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
      >
        {itemTheme ? (
          <Text
            style={{
              color: theme.colors.text.textTertiary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.xs,
            }}
          >
            {itemTheme}
          </Text>
        ) : (
          <></>
        )}
        <Text
          style={{
            color: theme.colors.text.textPrimary,
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.fontSize.md,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
          textBreakStrategy="highQuality" // 안드로이드
          lineBreakStrategyIOS="hangul-word" // iOS
        >
          {sightTitle}
        </Text>
      </View>
    </View>
  );
};

export default SightDocentBriefInfo;
