import * as React from 'react';
import {Button, Form, Space, Typography} from "antd";
import { RecommendationInput } from "../recommendationInput";
import mockedTreatments from "../../mock/treatments";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Uuid} from "../../helpers";

const {Title} = Typography;

export const ProcedureSection = () => {
    return (
        <>
            <Title level={4}>Procedury</Title>
            <Form.List name="recommendations">
                {(fields: any, options: any) => {
                    console.log(fields)
                    return (
                        <Space style={{width: '100%'}} direction={"vertical"}>
                            {fields.map((field: any) => {
                                return (
                                    <Space key={field.key} direction={"horizontal"} align={"baseline"}>
                                        <Form.Item  {...field} fieldKey={field.fieldKey}>
                                            <RecommendationInput treatments={mockedTreatments} onChange={() => {
                                            }}/>
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            style={{marginLeft: "10px"}}
                                            onClick={() => {
                                                options.remove(field.name);
                                            }}
                                        />
                                    </Space>
                                );
                            })}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        options.add();
                                    }}
                                    block
                                >
                                    <PlusOutlined/> Dodaj procedurę
                                </Button>
                            </Form.Item>
                        </Space>
                    );
                }}
            </Form.List>
        </>
    );
};