import * as React from 'react';
import {Button, Modal, Table} from "antd";
import {ReactElement, useEffect, useState} from "react";
import {RawConstraint} from "../../mock/constraints";
import {Treatment} from "../../models/treatment";
import {RawProximityConstraint} from "../../models/rawProximityConstraint";
import treatments from "../../mock/treatments";

interface TreatmentConstraintsProps {
    treatments: Treatment[]
    treatmentsConstraints: { [key: string]: RawConstraint[] }
}

interface TreatmentConstraintsUIModel {
    id: string,
    procedure: string,
    duration: number,
    constraints: RawConstraint[]
}

export const TreatmentConstraints = (props: TreatmentConstraintsProps) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [data, setDate] = useState<TreatmentConstraintsUIModel[]>([])

    const processProps = (props: TreatmentConstraintsProps) => {
        let processedData: TreatmentConstraintsUIModel[] = []

        for (let treatment of props.treatments) {
            let treatmentConstraints = props.treatmentsConstraints[treatment.Id]

            processedData.push({
                duration: treatment.DurationInMinutes,
                procedure: treatment.Name,
                id: treatment.Id,
                constraints: treatmentConstraints ? treatmentConstraints : []
            })
        }

        return processedData;
    }

    const constraintUI: { [key: string]: (data: RawConstraint) => ReactElement } = {
        "proximity": (data: RawConstraint) => {
            let proximity = data as RawProximityConstraint;
            let beforeOrAfter = proximity.Offset > 0 ? "przed" : "po";
            let constraintTreatment = treatments.find(x => x.Id === proximity.TreatmentId);
            if (!constraintTreatment) throw new Error(`Nie znaleziono procedury o id ${proximity.TreatmentId}`);
            return (<span>{Math.abs(proximity.Offset)}min {beforeOrAfter} {constraintTreatment.Name}</span>)
        }
    }

    useEffect(() => {
        console.log("USE EFFECT")
        setDate(processProps(props))
    }, [props])

    const columns = [
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
                return <>
                    {
                        constraints.length > 0 ?
                            constraints.map(constraint => {
                                let renderFn = constraintUI[constraint.Type];
                                return renderFn ? renderFn(constraint) :
                                    <span>{`Nie znaleziono ograniczenia o type: ${constraint.Type}`}</span>;
                            }) : <span>Brak ograniczeń</span>}
                </>;
            },
        },
    ]

    return (
        <>
            <Button onClick={() => setIsModalVisible(!isModalVisible)}>
                Procedury
            </Button>
            <Modal title="Szczegóły dotyczące procedur"
                   visible={isModalVisible}
                   onCancel={() => setIsModalVisible(false)}
                   onOk={() => setIsModalVisible(false)}
            >
                <Table columns={columns} dataSource={data} pagination={false}/>

            </Modal>
        </>
    );
};