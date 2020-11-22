import * as React from 'react';
import {Button, Form, Space, Typography} from 'antd';
import TreatmentInput from '../treatment-input';
import mockedTreatments from '../../mock/treatments';
import {PlusOutlined} from '@ant-design/icons';

const {Title} = Typography;

export const ProcedureSection = () => {
    return (
        <>
            <Title level={4}>Procedury</Title>
            <Form.List name='recommendations'>
                {(fields: any, options: any) => {
                    return (
                        <Space style={{width: '100%'}} direction={'vertical'}>
                            {fields.map((field: any) => {
                                return (
                                    <Space key={field.key} direction={'horizontal'}
                                           align={'baseline'}>
                                        <Form.Item  {...field} fieldKey={field.fieldKey}>
                                            <TreatmentInput treatments={mockedTreatments}
                                                            onDelete={() => {
                                                                options.remove(field.name);
                                                            }} onChange={() => {
                                            }}/>
                                        </Form.Item>
                                    </Space>
                                );
                            })}
                            <Form.Item>
                                <Button
                                    type='dashed'
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