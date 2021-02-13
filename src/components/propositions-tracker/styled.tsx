import styled from "styled-components";

export const TrackerContainer = styled.div`
  background-color: #1890ff;
  color: white;
  & * {
    color: white;
  }
  font-weight: bold;
  padding: 3.5rem 3rem;
  height: 100%;
  width: 100%;
`;

export const TrackerBtnContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  width: 100%;

  & > .ant-btn {
    margin-right: 2rem;
  }
`;
