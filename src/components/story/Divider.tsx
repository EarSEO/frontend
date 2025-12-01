import styled from "styled-components/native";

import { theme } from "@/styles/theme";

interface DividerProps {
  width?: string;
  height?: string;
  color?: string;
}

const Divider = styled.View<DividerProps>`
  width: 100%;
  background-color: ${theme.colors.background.background400};
  height: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

export default Divider;
