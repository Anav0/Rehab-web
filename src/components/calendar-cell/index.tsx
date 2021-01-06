import React, { useEffect, useState } from "react";
import { Affix, Button, Collapse, Modal } from "antd";
import { SiteDetails } from "../timeblock-details";
import { CalendarCellData } from "../../models/calendarCellData";
import { Uuid } from "../../helpers/uuid";
import {
  AddPropositionBtn,
  CalendarCellTextContainer,
  CellContainer,
} from "./styled";
import {
  changeCellDataStyle,
  getLeftCapacity,
  getOriginalCapacity,
} from "./operations";
import { Treatment } from "../../models/treatment";
import { MinusOutlined, CheckOutlined } from "@ant-design/icons";
import { usePropositions } from "../../store/propositions";

const { Panel } = Collapse;

interface CalendarCellProps {
  treatmentsDict: { [key: string]: Treatment };
  isProposed: boolean;
  cellData: CalendarCellData;
}

export const CalendarCell = (props: CalendarCellProps) => {
  const [visible, setVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const [
    { acceptedPropositions },
    { addAcceptedProposition, removeAcceptedProposition },
  ] = usePropositions();

  let orig = getOriginalCapacity(props.cellData);
  let left = getLeftCapacity(props.cellData);
  let used = orig - left;
  changeCellDataStyle(orig, left, props.cellData);

  useEffect(() => {
    setIsAccepted(acceptedPropositions.has(props.cellData.timeBlock.Id));
    console.log(isAccepted);
  }, [acceptedPropositions, props.cellData, props.isProposed]);

  return (
    <>
      <CellContainer style={props.cellData.style}>
        <CalendarCellTextContainer onClick={() => setVisible(true)}>
          <span>
            {used}
            {"/"}
            {orig}
          </span>
        </CalendarCellTextContainer>
        {props.isProposed ? (
          <AddPropositionBtn
            icon={isAccepted ? <MinusOutlined /> : <CheckOutlined />}
            shape="circle"
            type={isAccepted ? "primary" : "dashed"}
            size={"large"}
            onClick={() => {
              isAccepted
                ? removeAcceptedProposition(props.cellData.timeBlock.Id)
                : addAcceptedProposition(props.cellData.timeBlock.Id);
            }}
          />
        ) : (
          <></>
        )}
      </CellContainer>
      <Modal
        title="Sale"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Collapse ghost defaultActiveKey={["1"]}>
          {props.cellData.timeBlock ? (
            props.cellData.timeBlock.Sites.map((x) => {
              return (
                <Panel key={Uuid.uuidv4()} header={x.Name}>
                  <SiteDetails treatmentsDict={props.treatmentsDict} site={x} />
                </Panel>
              );
            })
          ) : (
            <></>
          )}
        </Collapse>
      </Modal>
    </>
  );
};
