import styled from "styled-components";

export const WeekPlannerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(1fr, 7);
  grid-auto-rows: 1fr;
  margin-top: 5rem;
  grid-gap: 0.5rem;
`;

export const WeekPlannerElement = styled.span`
  place-self: center;
  cursor: default;
`;

export const WeekPlannerDay = styled(WeekPlannerElement)`
  width: 8rem;
  min-height: 4rem;
`;
