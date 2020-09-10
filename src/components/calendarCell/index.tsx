import React, { CSSProperties, useState } from "react";
import { Modal } from "antd";
import { SiteDetails } from "../timeBlockDetails";
import "./index.css";
import { Uuid } from "../../helpers";
import { TreatmentSite } from "../../models/treatmentSite";
import { CalendarCellData } from "../../models/calendarCellData";
import { Collapse } from "antd";
import {defaultBlocksConfig} from "../../models/timeBlockConfig";
import {Patient} from "../../models/patient";

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

  const getOriginalCapacity = () => {
    return props.cellData.timeBlock.Sites.reduce((prev, curr, i, arr) => {
      return prev + curr.OriginalCapacitySum;
    }, 0);
  };

  const getLeftCapacity = () => {
    return props.cellData.timeBlock.Sites.reduce((prev, curr, i, arr) => {
      let value = 0;
      for (let property in curr.Capacity) {
        value += +curr.Capacity[property]
      }
      return prev + value;
    }, 0);

  };

  let orig = getOriginalCapacity()
  let left = getLeftCapacity()
  let used = orig - left;
  let percent = (used / orig)*100
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
        {used}
        { "/" }
        {orig}
      </div>
      <Modal
        title="Sale"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Collapse ghost defaultActiveKey={["1"]}>
          {props.cellData.timeBlock.Sites.map((x) => {
            return (
              <Panel key={Uuid.uuidv4()} header={x.Name}>
                <SiteDetails site={x} />
              </Panel>
            );
          })}
        </Collapse>
      </Modal>
    </>
  );
};
