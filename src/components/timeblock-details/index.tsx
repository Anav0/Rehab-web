import {Descriptions, List} from "antd";
import React, {useEffect, useState} from "react";
import {api} from "../../api";
import {Uuid} from "../../helpers/uuid";
import {Sex} from "../../models/patient";
import {Treatment} from "../../models/treatment";
import {TreatmentSite} from "../../models/treatmentSite";
import {getTreatmentFullness} from "./operations";

interface SiteDetailsProps {
    site: TreatmentSite;
    treatmentsDict: { [key: string]: Treatment };
}

export const SiteDetails = (props: SiteDetailsProps) => {
    const colorOptions: { [key: string]: string } = {};
    const capacityFullness: { [key: string]: number } = {};

    const [patientNames, setPatientNames] = useState<JSX.Element[]>([]);
    const descriptors = [];
    let i = 0;

    for (let treatmentId in props.site.Capacity) {
        let treatment = props.treatmentsDict[treatmentId];
        if (!treatment) throw Error("Treatment not found");
        capacityFullness[treatmentId] = getTreatmentFullness(props.site, treatmentId);
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
        if (!treatment) throw Error("Treatment not found");
        descriptors.push(
            <Descriptions.Item
                key={Uuid.uuidv4()}
                label={
                    <span style={{color: colorOptions[treatment.Id]}}>
            {treatment
                ? `${treatment.Name} ${
                    props.site.SexConstraintTreatments.hasOwnProperty(
                        treatment.Id,
                    )
                        ? "[Jedna płeć]"
                        : ""
                }`
                : "Nie znaleziono zabiegu"}
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

    useEffect(() => {
        const fetchPatients = async () => {
            let patientIds = new Map<string, string>(); // PatientId - TreatmentId

            for (const [_, value] of Object.entries(props.site.VisitsScheduled)) {
                patientIds.set(value.PatientId, value.TreatmentId);
            }

            try {
                let {data: patients} = await api.patients.withIds(
                    Array.from(patientIds.keys()),
                );
                let patientNames = patients.map((patient, i) => {
                    let treatmentId = patientIds.get(patient.Id);
                    if (!treatmentId) throw Error("Not treatment found");
                    let color = colorOptions[+treatmentId];
                    return (
                        <span key={Uuid.uuidv4()} style={{color}}> {i+1} {patient.Name} {Sex[patient.Sex][0]}</span>);
                });
                setPatientNames(patientNames);
            } catch (error) {
                console.error(error);
                alert("Failed to fetch patients for given site");
            }

        };
        fetchPatients();
    }, []);

    return (
        <Descriptions
            bordered
            column={{xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1}}
        >
            {descriptors}
            <Descriptions.Item label="Zapisani pacjenci">
                <List
                    split={false}
                    dataSource={patientNames}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />
            </Descriptions.Item>
        </Descriptions>
    );
};
