import {TreatmentSite} from "../../models/treatmentSite";
import {Descriptions, List} from "antd";
import {Uuid} from "../../helpers/uuid";
import React from "react";
import {Treatment} from "../../models/treatment";

const getTreatmentFullness = (site: TreatmentSite, treatmentId: string) => {
    let sum = 0;
    for (let appointment of site.Appointments) {
        if (appointment.TreatmentId === treatmentId) sum++;
    }
    return sum;
};

export const generateDescriptors = (site: TreatmentSite, treatments: Treatment[], colorOptions: { [key: string]: string }) => {
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