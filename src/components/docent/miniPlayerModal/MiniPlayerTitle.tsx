import {
  Animated,
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useAudioPlayerStore } from "@/store/docent/useAudioPlayerStore";
import { useRouteStore } from "@/store/route/useRouteStore";
import View = Animated.View;

interface MiniPlayerModalTitleProps {
  onClose: (e: GestureResponderEvent) => void;
}

const MiniPlayerTitle: React.FC<MiniPlayerModalTitleProps> = ({
  onClose,
}: MiniPlayerModalTitleProps) => {
  const { getRouteTitle, getNumberOfQueuedDocent } = useRouteStore();
  const audioMetadata = useAudioPlayerStore((state) => state.audioMetadata);

  if (!audioMetadata?.routeItem) return <></>;

  return (
    <ExpandedTitleContainer
      style={{
        borderStyle: "solid",
        boxShadow: `0 0 10px 0.1px ${"#cccccc"}`,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View>
          <Image
            source={{ uri: audioMetadata.routeItem.itemImageUrl }}
            style={{
              height: 80,
              width: 80,
              borderRadius: theme.borderRadius.md,
              marginRight: 10,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 80,
              width: 80,
              borderRadius: theme.borderRadius.md,
              backgroundColor: "rgba(162,167,172,0.2)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <Ionicons
              name="musical-notes"
              size={30}
              color={theme.colors.white}
            />
          </View>
        </View>
        <View
          style={{
            padding: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.lg,
            }}
          >
            {getRouteTitle()}
          </Text>
          <Text
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.sm,
              marginTop: theme.spacing.sm,
            }}
          >
            {getNumberOfQueuedDocent()}개의 도슨트
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onClose}
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="chevron-down" size={30} color={theme.colors.black} />
      </Pressable>
    </ExpandedTitleContainer>
  );
};

const ExpandedTitleContainer = styled.View`
  background-color: ${theme.colors.background.background400};
  border-style: solid;
  border-radius: 10px;
  padding: ${theme.spacing.lg}px ${theme.spacing.lg}px;
  padding-bottom: 0;
  margin: ${theme.spacing.md}px ${theme.spacing.sm}px;
`;

export default MiniPlayerTitle;
