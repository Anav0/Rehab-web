import {TreatmentSite} from "../../models/treatmentSite";
import treatments from "../../mock/treatments";
import {Descriptions, List} from "antd";
import {Uuid} from "../../helpers/uuid";
import React from "react";
import {Sex} from "../../models/patient";

const getTreatmentFullness = (site: TreatmentSite, treatmentId: string) => {
    let sum = 0;
    for (let appointment of site.Appointments) {
        if (appointment.TreatmentId === treatmentId) sum++;
    }
    return sum;
};

export const generateColors = (site: TreatmentSite) => {
    const colorOptions: { [key: string]: string } = {};
    let i = 0;
    for (let property in site.Capacity) {
        let treatment = treatments.find((x) => x.Id === property);
        if (!treatment) throw Error('Treatment not found');
        let colorHSL = 50 + i * 50;
        if (colorHSL > 300) {
            i = 0;
            colorHSL = 50 + i * 50;
        }
        colorOptions[treatment.Id] = `hsl(${colorHSL},75%,50%)`;
        i++;
    }
    return colorOptions
}

export const generateDescriptors = (site: TreatmentSite, colorOptions: { [key: string]: string }) => {
    const descriptors = [];
    let capacityFullness: { [key: string]: number } = {};

    for (let property in site.Capacity) {
        capacityFullness[property] = getTreatmentFullness(site, property);
        let capacity = site.Capacity[property];
        let current = capacityFullness[property];
        let enlisted = `Zajęte miejsca: ${current}`;
        let free = `Wolne miejsca: ${capacity}`;
        let treatment = treatments.find((x) => x.Id === property);
        if (!treatment) throw Error('Treatment not found');
        descriptors.push(
            <Descriptions.Item
                key={Uuid.uuidv4()}
                label={
                    <span style={{color: colorOptions[treatment.Id]}}>
        {treatment ?
            `${treatment.Name} ${site.SexConstraintTreatments.length >
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
    return descriptors;
}

export const getPatientsNames = (site: TreatmentSite, colorOptions: { [key: string]: string }) => {
    return site.Appointments.map((x, i) => {
        let treatmentId = x.TreatmentId;
        let color = colorOptions[+treatmentId];
        return (
            <span key={Uuid.uuidv4()} style={{color}}>
                {x.Patient.Name} {Sex[x.Patient.Sex][0]}
            </span>
        );
    });
}