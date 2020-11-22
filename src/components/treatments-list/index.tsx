import * as React from 'react';
import {CSSProperties, ReactElement, useEffect, useState} from 'react';
import {Button, Modal, Space, Table} from 'antd';
import {RawConstraint} from '../../mock/constraints';
import {Treatment} from '../../models/treatment';
import {RawProximityConstraint} from '../../models/rawProximityConstraint';
import treatments, {treatmentsColors} from '../../mock/treatments';
import {ProfileTwoTone} from '@ant-design/icons';

interface TreatmentsListProps {
    treatments: Treatment[]
    treatmentsConstraints: { [key: string]: RawConstraint[] }
}

interface TreatmentListUIModel {
    id: string,
    procedure: string,
    duration: number,
    color: string,
    constraints: RawConstraint[]
}

export const TreatmentsList = (props: TreatmentsListProps) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [data, setDate] = useState<TreatmentListUIModel[]>([]);

    const processProps = (props: TreatmentsListProps) => {
        let processedData: TreatmentListUIModel[] = [];

        let i = 0;
        for (let treatment of props.treatments) {
            let treatmentConstraints = props.treatmentsConstraints[treatment.Id];

            processedData.push({
                duration: treatment.DurationInMinutes,
                procedure: treatment.Name,
                id: treatment.Id,
                constraints: treatmentConstraints ? treatmentConstraints : [],
                color: treatmentsColors[i],
            });
            i++;
        }

        return processedData;
    };

    const constraintUI: { [key: string]: (data: RawConstraint) => ReactElement } = {
        'proximity': (data: RawConstraint) => {
            let proximity = data as RawProximityConstraint;
            let beforeOrAfter = proximity.Offset > 0 ? 'przed' : 'po';
            let constraintTreatment = treatments.find(
                x => x.Id === proximity.TreatmentId);
            if (!constraintTreatment) throw new Error(
                `Nie znaleziono procedury o id ${proximity.TreatmentId}`);
            return (<span key={data.Type + '-' + constraintTreatment.Name +
            proximity.Offset}>{Math.abs(
                proximity.Offset)}min {beforeOrAfter} {constraintTreatment.Name}</span>);
        },
    };

    useEffect(() => {
        setDate(processProps(props));
    }, [props]);

    const columns = [
        {
            title: 'Kolor',
            dataIndex: 'color',
            key: 'color',
            render(color: string): JSX.Element {
                let style: CSSProperties = {
                    backgroundColor: color,
                    width: "25px",
                    height: "25px"
                }
                return <div style={style}/>
            }
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Procedura',
            dataIndex: 'procedure',
            key: 'procedure',
        },
        {
            title: 'Czas trwania',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Ograniczenia',
            dataIndex: 'constraints',
            key: 'constraints',
            render(constraints: RawConstraint[]) {
                return <Space direction={'vertical'}>
                    {
                        constraints.length > 0 ?
                            constraints.map(constraint => {
                                let renderFn = constraintUI[constraint.Type];
                                return renderFn ? renderFn(constraint) :
                                    <span>{`Nie znaleziono ograniczenia o type: ${constraint.Type}`}</span>;
                            }) : <span>Brak ograniczeń</span>}
                </Space>;
            },
        },
    ];

    return (
        <>
            <Button icon={<ProfileTwoTone/>} onClick={() => setIsModalVisible(!isModalVisible)}>Procedury</Button>
            <Modal title='Szczegóły dotyczące procedur'
                   visible={isModalVisible}
                   onCancel={() => setIsModalVisible(false)}
                   onOk={() => setIsModalVisible(false)}
            >
                <Table columns={columns} dataSource={data} pagination={false}/>

            </Modal>
        </>
    );
};