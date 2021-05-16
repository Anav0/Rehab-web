import {CheckOutlined, MinusOutlined} from "@ant-design/icons";
import {Collapse, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {Uuid} from "../../helpers/uuid";
import {CalendarCellData} from "../../models/calendarCellData";
import {Treatment} from "../../models/treatment";
import {useProposition} from "../../store/proposition";
import {SiteDetails} from "../timeblock-details";
import {getLeftCapacity, getOriginalCapacity, markCellBasedOnCapacity} from "./operations";
import {AddPropositionBtn, CalendarCellTextContainer, CellContainer} from "./styled";

const {Panel} = Collapse;

interface CalendarCellProps {
    treatmentsDict: { [key: string]: Treatment };
    isProposed: boolean;
    cellData: CalendarCellData;
}

export const CalendarCell = (props: CalendarCellProps) => {
    const [visible, setVisible] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    const [{acceptedDates}, {acceptBlocksWithDate, removeBlocksWithDate}] =
        useProposition();

    let orig = getOriginalCapacity(props.cellData);
    let left = getLeftCapacity(props.cellData);
    let used = orig - left;

    markCellBasedOnCapacity(orig, left, props.cellData);

    useEffect(() => {
        console.log("Calendar cell called...");
        for (let dates of Array.from(acceptedDates.values())) { //TODO: slow
            if (dates.includes(+props.cellData.timeBlock.StartDate)) {
                setIsAccepted(true);
                return;
            }
        }

    }, [props.cellData, props.isProposed, acceptedDates]);

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
                        icon={isAccepted ? <MinusOutlined/> : <CheckOutlined/>}
                        shape="circle"
                        type={isAccepted ? "primary" : "dashed"}
                        size={"large"}
                        onClick={() => {
                            isAccepted
                                ? removeBlocksWithDate(+props.cellData.timeBlock.StartDate)
                                : acceptBlocksWithDate(+props.cellData.timeBlock.StartDate);
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
                                    <SiteDetails treatmentsDict={props.treatmentsDict} site={x}/>
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
