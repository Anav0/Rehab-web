import * as React from 'react';
import {Form, InputNumber, Typography} from "antd";

const {Title} = Typography;

export const SuggestedSolutionsSection = () => {
    return (
        <>
            <Title level={4}>Ilość proponowanych rozwiązań</Title>
            <Form.Item name="numberOfSolutions" initialValue={4} required>
                <InputNumber min={1} max={4}/>
            </Form.Item>
        </>
    );
};