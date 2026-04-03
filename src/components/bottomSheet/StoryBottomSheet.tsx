import styled from "styled-components/native";

import { useBaseMap } from "@/hooks/useBaseMap";

import { useStoryStore } from "@/store/story/useStoryStore";

import MainStoryHeader from "../story/MainStoryHeader";
import StorySpotHeader from "../story/StorySpotHeader";
import SummaryCard from "../story/SummaryCard";

const StoryBottomSheet = () => {
  const briefSpotInfo = useStoryStore((state) => state.briefSpotInfo);
  const selectedSpotSpotId = briefSpotInfo?.storySpotId;

  return (
    <Container>
      {selectedSpotSpotId ? <StorySpotHeader /> : <MainStoryHeader />}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;
export default StoryBottomSheet;
