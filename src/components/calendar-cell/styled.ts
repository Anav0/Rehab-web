import { Button } from "antd";
import styled from "styled-components";

export const CellContainer = styled.div`
  cursor: pointer;
  position: relative;
  max-width: 4rem;
  max-height: 4rem;
`;

export const AddPropositionBtn = styled(Button)`
  position: absolute;
  top: -1rem;
  right: -1.2rem;
  z-index: 10;
`;

export const CalendarCellTextContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
