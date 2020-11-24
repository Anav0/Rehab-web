import styled, {css} from 'styled-components'
import {Space} from "antd";

export const AppHeader = styled.div`
 display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    grid-column: 1/12;
    grid-row: 1/2;
    place-self: center;
`

export const AppLayout = styled.main`
    width: 100%;
    height: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
`

const position = css`
  grid-row: 2/3
`

export const AppHeaderContent = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 2fr 1fr;
    grid-gap: 2rem 1rem;
`

export const AppHeaderProcedures = styled(Space)`
    ${position};
    place-self: center end;
`

export const AppHeaderDate = styled(Space)`
      ${position};
      place-self: center;
`

export const AppHeaderSelectedDate = styled.span`
    grid-column: 2/3;
    place-self: center;
    font-weight: bold;
    font-size: 1.25rem;
`
export const AppHeaderActions = styled(Space)`
    ${position};
    place-self: center start;

`