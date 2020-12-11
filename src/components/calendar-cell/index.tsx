import React, {useState} from 'react';
import {Collapse, Modal} from 'antd';
import {SiteDetails} from '../timeblock-details';
import {CalendarCellData} from '../../models/calendarCellData';
import {Uuid} from '../../helpers/uuid';
import {CellContainer} from "./styled";
import {changeCellDataStyle, getLeftCapacity, getOriginalCapacity} from "./operations";
import {Treatment} from "../../models/treatment";

const {Panel} = Collapse;

interface CalendarCellProps {
    treatmentsDict: { [key: string]: Treatment }
    cellData: CalendarCellData
}

export const CalendarCell = (props: CalendarCellProps) => {
    const [visible, setVisible] = useState(false);

    let orig = getOriginalCapacity(props.cellData);
    let left = getLeftCapacity(props.cellData);
    let used = orig - left;
    changeCellDataStyle(orig, left, props.cellData);
    console.log(orig,left,used)
    return (
        <>
            <CellContainer
                style={props.cellData.style}
                onClick={() => setVisible(true)}

            >
                {used}
                {'/'}
                {orig}
            </CellContainer>
            <Modal
                title='Sale'
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <Collapse ghost defaultActiveKey={['1']}>
                    {props.cellData.timeBlock.Sites.map((x) => {
                        return (
                            <Panel key={Uuid.uuidv4()} header={x.Name}>
                                <SiteDetails treatmentsDict={props.treatmentsDict} site={x}/>
                            </Panel>
                        );
                    })}
                </Collapse>
            </Modal>
        </>
    )
}