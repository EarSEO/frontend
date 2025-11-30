import { ScrollView, Text } from "react-native";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";

const MiniPlayerModalLyrics: React.FC = () => {
  const { currentScript } = useAudioPlayerStore();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        marginHorizontal: (theme.spacing.lg + theme.spacing.xl) / 2,
      }}
    >
      <Text
        style={{
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.xxl,
          lineHeight: theme.typography.fontSize.xxl * 2,
          marginTop: theme.spacing.lg,
        }}
      >
        {currentScript}
      </Text>
    </ScrollView>
  );
};

export default MiniPlayerModalLyrics;
