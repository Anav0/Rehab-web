import * as React from 'react';
import {Form, Tag, Typography} from "antd";
import {Uuid} from "../../helpers";
import {ReactElement, useState} from "react";
import {ProximityConstraint} from "../proximityConstraint";

const {CheckableTag} = Tag;
const {Title} = Typography;

export const ConstraintsSection = () => {
    const [selectedConstraints, setSelectedConstraints] = useState<any>([]);

    const constraintsUI: { [key: string]: ReactElement } = {
        odległość: (
            <Form.Item name="proximity" key="form-proximity-part">
                <ProximityConstraint
                    onChange={()=>{}}
                />
            </Form.Item>
        ),
    };

    const onSelectedConstraintsChange = (tag: string, checked: boolean) => {
        const nextSelectedConstraints = checked
            ? [...selectedConstraints, tag]
            : selectedConstraints.filter((t: any) => t !== tag);
        setSelectedConstraints(nextSelectedConstraints)
    };

    return (
       <>
           <Title level={4}>Ograniczenia</Title>
           <Form.Item label="Dostępne ograniczenia">
               {Object.keys(constraintsUI).map((x) => {
                   return (
                       <CheckableTag
                           key={Uuid.uuidv4()}
                           checked={selectedConstraints.indexOf(x) > -1}
                           onChange={(checked) =>
                               onSelectedConstraintsChange(x, checked)
                           }
                       >
                           {x}
                       </CheckableTag>
                   );
               })}
           </Form.Item>
           {selectedConstraints.map((x: any) => {
               return constraintsUI[x];
           })}
       </>
    );
};