import styled from "styled-components";
import {Form} from "antd";

export const DayPreference = styled.div`
    margin-top: 10px;
    width: 100%;
    display: flex;
    align-items: baseline;
    
    .ant-select {
      width: 10rem !important;
    }

`

export const NewAppointmentForm = styled(Form)`
    .ant-typography{
        margin-bottom: 1.25rem;
    }
`