import React, { CSSProperties, useState } from "react";
import { Appointment } from "../../models/appointment";
import { Modal } from "antd";
import { AppointmentUI } from "../appointment";
import "./index.css";
import {Uuid} from "../../helpers";

interface CalendarCellProps {
  appointments: Appointment[];
  maxNumberOfPatients: number;
  style: CSSProperties;
  isNew: boolean
}

export const CalendarCell = (props: CalendarCellProps) => {
  const [visible, setVisible] = useState(false);

  const emptyColor = "transparent";
  const freeColor = "hsl(120,95%,80%)";
  const mediumColor = "hsl(45,95%,80%)";
  const fullColor = "hsl(360,95%,80%)";

  const getTotalNumberOfPatients = () => {
    return props.appointments.reduce((prev, curr, i, arr) => {
      return prev + curr.patients.length;
    }, 0);
  };

  let percent = (getTotalNumberOfPatients() / props.maxNumberOfPatients) * 100;
  if (!props.style.backgroundColor) {
    if (percent === 0) props.style.backgroundColor = emptyColor;
    if (percent > 0 && percent <= 25) props.style.backgroundColor = freeColor;
    if (percent > 25 && percent <= 100)
      props.style.backgroundColor = mediumColor;
    if (percent >= 100) props.style.backgroundColor = fullColor;
  }

  return (
    <>
      <div
        style={props.style}
        onClick={() => setVisible(true)}
        className={`cell-container ${props.isNew ? 'new-cell' : ''}`}
      >
        {getTotalNumberOfPatients()}
        {" / "}
        {props.maxNumberOfPatients}
      </div>
      <Modal
        title="Wizyty"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        {props.appointments.map((x) => {
          return <AppointmentUI key={Uuid.uuidv4()} appointment={x} />;
        })}
      </Modal>
    </>
  );
};
