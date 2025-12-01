import { useState } from "react";

import styled from "styled-components/native";

import { theme } from "@/styles/theme";

import { useStoryStore } from "@/store/useStoryStore";

import Button from "../common/Button";
import Input from "../common/Input";
import LocationLabel from "../common/LocationLabel";

interface SpotNameAddProps {
  onSpotNameChange: (name: string) => void;
}

const SpotLocationAdd = ({ onSpotNameChange }: SpotNameAddProps) => {
  const [newSpotname, setNSpotName] = useState<string>();
  const { searchTitleInfo } = useStoryStore();

  const handleSpotNamePass = (text: string) => {
    setNSpotName(text);
    onSpotNameChange(text);
  };

  return (
    <Container>
      <Content>
        <InputWrapper>
          <Input
            value={newSpotname}
            onChangeText={handleSpotNamePass}
            radius={10}
            placeholder="검색어를 입력하세요."
            backgroundColor={theme.colors.grey.neutral100}
            fontSize={theme.typography.fontSize.sm}
          />
        </InputWrapper>
        <SearchViewWrapper
          contentContainerStyle={{
            gap: 12,
          }}
        >
          {searchTitleInfo?.map((item) => (
            <LocationLabel key={item.storySpotId} locationTitle={item.title} />
          ))}
        </SearchViewWrapper>
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  position: relative;
`;

const Content = styled.View`
  flex: 1;
`;

const InputWrapper = styled.View``;

const SearchViewWrapper = styled.ScrollView`
  padding: 25px;
  flex: 1;
`;

export default SpotLocationAdd;
