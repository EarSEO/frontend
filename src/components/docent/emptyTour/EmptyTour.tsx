import { Animated, Text } from "react-native";

import styled from "styled-components/native";

import GoGetCourseButton from "@/components/docent/emptyTour/GoGetCourseButton";

import { theme } from "@/styles/theme";
import View = Animated.View;

const EmptyTour: React.FC = () => {
  const noCourseText = "선택된 경로가 없습니다.";
  return (
    <Container>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.text.textPrimary,
          }}
        >
          {noCourseText}
        </Text>
        <GoGetCourseButton />
      </View>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  min-height: ${theme.spacing.xxl * 4}px;
`;

export default EmptyTour;
