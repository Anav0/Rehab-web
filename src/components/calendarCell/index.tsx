import React, { CSSProperties, useState } from "react";
import { Modal } from "antd";
import { SiteDetails } from "../timeBlockDetails";
import "./index.css";
import { Uuid } from "../../helpers";
import { TreatmentSite } from "../../models/treatmentSite";
import { CalendarCellData } from "../../models/calendarCellData";
import { Collapse } from "antd";

const { Panel } = Collapse;

interface CalendarCellProps {
  cellData: CalendarCellData;
  isNew: boolean;
}

export const CalendarCell = (props: CalendarCellProps) => {
  const [visible, setVisible] = useState(false);

  const emptyColor = "transparent";
  const freeColor = "hsl(120,95%,80%)";
  const mediumColor = "hsl(45,95%,80%)";
  const fullColor = "hsl(360,95%,80%)";

  const getMaxNumberOfPatients = () => {
    return props.cellData.timeBlock.sites.reduce((prev, curr, i, arr) => {
      let value = 0;
      for (let property in curr.capacity) {
        value += +curr.capacity[property];
      }
      return prev + value;
    }, 0);
  };

  const getTotalNumberOfPatients = () => {
    return props.cellData.timeBlock.sites.reduce((prev, curr, i, arr) => {
      return prev + curr.appointments.length;
    }, 0);
  };

  let percent = (getTotalNumberOfPatients() / getMaxNumberOfPatients()) * 100;
  if (!props.cellData.style.backgroundColor) {
    if (percent === 0) props.cellData.style.backgroundColor = emptyColor;
    if (percent > 0 && percent <= 25)
      props.cellData.style.backgroundColor = freeColor;
    if (percent > 25 && percent <= 100)
      props.cellData.style.backgroundColor = mediumColor;
    if (percent >= 100) props.cellData.style.backgroundColor = fullColor;
  }

  return (
    <>
      <div
        style={props.cellData.style}
        onClick={() => setVisible(true)}
        className={`cell-container ${props.isNew ? "new-cell" : ""}`}
      >
        {getTotalNumberOfPatients()}
        {" / "}
        {getMaxNumberOfPatients()}
      </div>
      <Modal
        title="Sale"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Collapse ghost defaultActiveKey={["1"]}>
          {props.cellData.timeBlock.sites.map((x) => {
            return (
              <Panel key={Uuid.uuidv4()} header={x.name}>
                <SiteDetails site={x} />
              </Panel>
            );
          })}
        </Collapse>
        ,
      </Modal>
    </>
  );
};
