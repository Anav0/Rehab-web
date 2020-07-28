import React, { useState } from "react";
import "./index.css";
import { Appointment } from "../../models/appointment";
import { dateToTime } from "../../helpers";
import { Popover } from "antd";

interface AppointmentProps {
  appointment: Appointment;
}

export const AppointmentUI = (props: AppointmentProps) => {
  const [visible, setVisible] = useState(false);

  const patientsUI = props.appointment.patients.map((x) => <li>{x.name}</li>);

  return (
    <Popover
      content={patientsUI}
      title="Zapisani pacjenci"
      trigger="click"
      placement="right"
      visible={visible}
      onVisibleChange={setVisible}
    >
      <div className="schedule-container">
        <span>{props.appointment.treatment.name}</span>
        <span>
          {dateToTime(props.appointment.startDate)}
          {" - "}
          {dateToTime(props.appointment.endDate)}
        </span>
      </div>
    </Popover>
  );
};
