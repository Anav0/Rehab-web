import styled from "styled-components";

export const TrackerContainer = styled.div`
  background-color: #1890ff;
  color: white;
  & * {
    color: white;
  }
  font-weight: bold;
  padding: 3.5rem 3rem;
  position: fixed;
  bottom: 10rem;
  right: 8rem;
  z-index: 15;
`;

export const TrackerBtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  width: 100%;
`;
