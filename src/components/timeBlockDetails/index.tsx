import React from "react";
import "./index.css";
import { Uuid } from "../../helpers";
import { List, Space } from "antd";
import { TreatmentSite } from "../../models/treatmentSite";
import { Descriptions } from "antd";
import treatments from "../../mock/treatments";

interface SiteDetailsProps {
  site: TreatmentSite;
}

export const SiteDetails = (props: SiteDetailsProps) => {
  const colorOptions: string[] = [];

  const getTreatmentFullness = (site: TreatmentSite, treatmentId: string) => {
    let sum = 0;
    for (let appointment of site.appointments) {
      if (appointment.treatment.id === treatmentId) sum++;
    }
    return sum;
  };

  let capacityFullness: { [key: string]: number } = {};
  const descriptors = [];
  let i = 0;
  for (let property in props.site.capacity) {
    capacityFullness[property] = getTreatmentFullness(props.site, property);
    let colorHSL = 200 + i * 40;
    if (colorHSL > 300) {
      i = 0;
      colorHSL = 100 + i * 40;
    }
    colorOptions.push(`hsl(${colorHSL},75%,50%)`);
    i++;
  }
  i = 0;
  for (let property in props.site.capacity) {
    let capacity = props.site.capacity[property];
    let current = capacityFullness[property];
    let enlisted = `Zapisani: ${current}`;
    let free = `Pozostało: ${capacity}`;
    let treatment = treatments.find((x) => x.id === property);
    descriptors.push(
      <Descriptions.Item
        key={Uuid.uuidv4()}
        label={
          <span style={{ color: colorOptions[i] }}>
            {treatment ? treatment.name : "Nie znaleziono zabiegu"}
          </span>
        }
      >
        <List
          split={false}
          dataSource={[enlisted, free]}
          renderItem={(text) => <List.Item>{text}</List.Item>}
        ></List>
      </Descriptions.Item>
    );
    i++;
  }

  let patientNames = props.site.appointments.map((x, i) => {
    let treatmentId = x.treatment.id;
    let color = colorOptions[+treatmentId];
    return (
      <span key={Uuid.uuidv4()} style={{ color }}>
        {x.patient.name}
      </span>
    );
  });
  return (
    <Descriptions
      bordered
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
    >
      {descriptors}
      <Descriptions.Item label="Zapisani pacjenci">
        <List
          split={false}
          dataSource={patientNames}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        ></List>
        <Space></Space>
      </Descriptions.Item>
    </Descriptions>
  );
};
