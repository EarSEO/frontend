import React from "react";

import styled from "styled-components/native";

import {useMapHeaderStore} from "@/store/useMapHeaderStore";

const MapHeader: React.FC = () => {
  const mapHeaderContent = useMapHeaderStore(state => state.mapHeaderContent);
  return (
    <OverlayWrapper pointerEvents="box-none">
      <HeaderContainer>
        {mapHeaderContent}
      </HeaderContainer>
    </OverlayWrapper>
  );
};

const OverlayWrapper = styled.SafeAreaView`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const HeaderContainer = styled.View`
  position: fixed;
  top: 5px;
  width: 95%;
  align-self: center;
`;

export default React.memo(MapHeader);
