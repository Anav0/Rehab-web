import React, {useState} from 'react';
import {Button, Form, notification, Space, Typography} from 'antd';
import {parseTimeBlocksFromPayload,} from '../../helpers';
import {TimeBlock} from '../../models/timeBlock';
import {TimeSection} from './time-section';
import {ProcedureSection} from './procedure-section';
import {PatientSection} from './patient-section';
import {AppointmentFormData} from '../../models/appointmentFormData';
import {UnableSection} from './unable-section';
import {useTimeBlocks} from "../../store/timeBlocks";
import {useSelectedDate} from "../../store/selectedDate";
import {NewAppointmentForm} from "./styled";
import {schedule} from "./oprations";
import {usePatients} from "../../store/patients";

const {Title} = Typography;

const AppointmentForm = (props: any) => {
    const [{timeBlocks}, {bulkUpdateBlocks}] = useTimeBlocks()
    const [, {updateSelectedDate}] = useSelectedDate()
    const [, {changeSelectedPatient}] = usePatients()

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const send = async (formData: AppointmentFormData) => {
        setIsProcessing(true)
        try {
            changeSelectedPatient(formData.patient);
            const response = await schedule(formData, timeBlocks)
            const schedulingResult = response.data;
            let parsedTimeBlocks = parseTimeBlocksFromPayload(schedulingResult);
            bulkUpdateBlocks(parsedTimeBlocks);
            let sol = schedulingResult.Solutions[0].Solution;
            let blocks: TimeBlock[] = [];
            if (sol)
                blocks = sol.Blocks;

            props.OnSendSuccess(formData.unavailableDates);

            notification.success({
                message: 'Sukces',
                onClick: () => {
                    updateSelectedDate(blocks[0].StartDate);
                },
                description: (
                    <Space direction='vertical'>
                <span>
                    {new Date(blocks[0].StartDate).toLocaleString('pl', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        weekday: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
                    </Space>
                ),
            });
            setIsProcessing(false)
        } catch (error) {
            console.log("C")
            console.error(error)
            let errMsg =
                error.response && error.response.data.error
                    ? error.response.data.error
                    : error.message;

            notification.open({
                message: 'Error',
                description: errMsg,
            });
            setIsProcessing(false)
        }
    };

    return (
        <NewAppointmentForm onFinish={(values: any) => send(values)}>
            <Title level={3}>Formularz zabiegowy</Title>
            <PatientSection/>
            <UnableSection/>
            <TimeSection/>
            <ProcedureSection/>
            <Form.Item>
                <Button
                    loading={isProcessing}
                    type='primary'
                    htmlType='submit'
                >
                    Wyślij
                </Button>
            </Form.Item>
        </NewAppointmentForm>
    );
}

export default AppointmentForm;
