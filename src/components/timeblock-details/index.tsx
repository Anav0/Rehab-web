import React from 'react';
import {Descriptions, List} from 'antd';
import {TreatmentSite} from '../../models/treatmentSite';
import {Sex} from '../../models/patient';
import {Uuid} from '../../helpers/uuid';
import {Treatment} from "../../models/treatment";

interface SiteDetailsProps {
    site: TreatmentSite;
    treatmentsDict: { [key: string]: Treatment }
}

export const SiteDetails = (props: SiteDetailsProps) => {
    const colorOptions: { [key: string]: string } = {};

    const getTreatmentFullness = (site: TreatmentSite, treatmentId: string) => {
        let sum = 0;
        for (let appointment of site.Appointments) {
            if (appointment.TreatmentId === treatmentId) sum++;
        }
        return sum;
    };

    let capacityFullness: { [key: string]: number } = {};
    const descriptors = [];
    let i = 0;
    for (let property in props.site.Capacity) {
        let treatment = props.treatmentsDict[property];
        if (!treatment) throw Error('Treatment not found');
        capacityFullness[property] = getTreatmentFullness(props.site, property);
        let colorHSL = 50 + i * 50;
        if (colorHSL > 300) {
            i = 0;
            colorHSL = 50 + i * 50;
        }
        colorOptions[treatment.Id] = `hsl(${colorHSL},75%,50%)`;
        i++;
    }
    for (let property in props.site.Capacity) {
        let capacity = props.site.Capacity[property];
        let current = capacityFullness[property];
        let enlisted = `Zajęte miejsca: ${current}`;
        let free = `Wolne miejsca: ${capacity}`;
        let treatment = props.treatmentsDict[property];
        if (!treatment) throw Error('Treatment not found');
        descriptors.push(
            <Descriptions.Item
                key={Uuid.uuidv4()}
                label={
                    <span style={{color: colorOptions[treatment.Id]}}>
            {treatment ?
                `${treatment.Name} ${props.site.SexConstraintTreatments.length >
                0 ? 'S' : ''}` :
                'Nie znaleziono zabiegu'}
          </span>
                }
            >
                <List
                    split={false}
                    dataSource={[enlisted, free]}
                    renderItem={(text) => <List.Item>{text}</List.Item>}
                />
            </Descriptions.Item>,
        );
    }

    let patientNames = props.site.Appointments.map((x, i) => {
        let treatmentId = x.TreatmentId;
        let color = colorOptions[+treatmentId];
        return (
            <span key={Uuid.uuidv4()} style={{color}}>
        {x.Patient.Name} {Sex[x.Patient.Sex][0]}
      </span>
        );
    });
    return (
        <Descriptions
            bordered
            column={{xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1}}
        >
            {descriptors}
            <Descriptions.Item label='Zapisani pacjenci'>
                <List
                    split={false}
                    dataSource={patientNames}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />

            </Descriptions.Item>
        </Descriptions>
    );
};
