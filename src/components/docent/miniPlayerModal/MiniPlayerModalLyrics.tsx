import { ScrollView, Text } from "react-native";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";

const MiniPlayerModalLyrics: React.FC = () => {
  const audioMetadata = useAudioPlayerStore((state) => state.audioMetadata);
  if (!audioMetadata?.script) return <></>;
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
        {audioMetadata.script}
      </Text>
    </ScrollView>
  );
};

export default MiniPlayerModalLyrics;
