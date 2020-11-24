import React from 'react';
import {Descriptions, List} from 'antd';
import {TreatmentSite} from '../../models/treatmentSite';
import {generateColors, generateDescriptors, getPatientsNames} from "./operations";

interface SiteDetailsProps {
    site: TreatmentSite;
}

export const SiteDetails = (props: SiteDetailsProps) => {
    const colorOptions = generateColors(props.site)
    const descriptors = generateDescriptors(props.site, colorOptions)
    const patientNames = getPatientsNames(props.site, colorOptions)

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
