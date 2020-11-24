import React, {useState} from 'react';
import {Collapse, Modal} from 'antd';
import {SiteDetails} from '../timeblock-details';
import {CalendarCellData} from '../../models/calendarCellData';
import {Uuid} from '../../helpers/uuid';
import {CellContainer} from "./styled";
import {changeCellDataStyle, getLeftCapacity, getOriginalCapacity} from "./operations";

const {Panel} = Collapse;

interface CalendarCellProps {
    cellData: CalendarCellData
}

export const CalendarCell = (props: CalendarCellProps) => {
    const [visible, setVisible] = useState(false);

    let orig = getOriginalCapacity(props.cellData);
    let left = getLeftCapacity(props.cellData);
    let used = orig - left;
    changeCellDataStyle(orig, left, props.cellData);

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
                                <SiteDetails site={x}/>
                            </Panel>
                        );
                    })}
                </Collapse>
            </Modal>
        </>
    )
}