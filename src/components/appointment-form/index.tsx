import './index.css';
import React, {useEffect, useState} from 'react';
import {Button, Form, notification, Space, Typography} from 'antd';
import {ApiPayload} from '../../models/apiPayload';
import api from '../../api';
import {getAllTreatmentsAsDict, parseTimeBlocksFromPayload,} from '../../helpers';
import {TimeBlock} from '../../models/timeBlock';
import {Referral} from '../../models/referral';
import {TimeSection} from './time-section';
import {ProcedureSection} from './procedure-section';
import {PatientSection} from './patient-section';
import {AppointmentFormData} from '../../models/appointmentFormData';
import {UnableSection} from './unableSection';
import {filterTimeBlocksByDates} from '../../mock/timeBlocks';
import {treatmentConstraints} from '../../mock/treatmentConstraints';
import {useTimeBlocks} from "../../store/timeBlocks";
import {useSelectedDate} from "../../store/selectedDate";
import {useMarkers} from "../../store/markers";
import {MarkCellsContainingBlocks} from "../../helpers/calendar-marking/MarkCellsContainingBlocks";

const {Title} = Typography;

const AppointmentForm = (props: any) => {
    const [{timeBlocks}, {bulkUpdateBlocks}] = useTimeBlocks()
    const [{selectedDate}, {updateSelectedDate}] = useSelectedDate()
    const [, {changeMarker}] = useMarkers()

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const compilePreferences = (values: AppointmentFormData) => {
        let allPreferences: any = [];
        let preference: any = {type: 'time', days: []};
        for (let value of values.times) {
            let day: any = {
                dayOfWeek: +value.day,
                start: value.hourRange[0]._d.toISOString(),
                end: value.hourRange[1]._d.toISOString(),
            };
            preference.days.push(day);
        }
        allPreferences.push(preference);

        return allPreferences;
    };

    const send = async (formData: AppointmentFormData) => {
        setIsProcessing(true)
        try {
            if (!formData.patient) throw new Error('Nie wybrano pacjenta');
            let payload = new ApiPayload(
                filterTimeBlocksByDates(timeBlocks, formData.unavailableDates),
                compilePreferences(formData),
                new Referral(formData.patient, formData.recommendations),
                treatmentConstraints,
                getAllTreatmentsAsDict(),
            );
            const response = await api.find.solution(payload);
            const schedulingResult = response.data;
            let parsedTimeBlocks = parseTimeBlocksFromPayload(schedulingResult);
            changeMarker(new MarkCellsContainingBlocks("Nowe wizyty",parsedTimeBlocks))
            bulkUpdateBlocks(parsedTimeBlocks);
            let sol = schedulingResult.TreatmentSolutionVariants[0].Solutions[0];
            let blocks: TimeBlock[] = [];
            if (sol)
                blocks = sol[0].Blocks;

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

    useEffect(() => {
        console.log(selectedDate)
    }, [selectedDate])

    return (
        <Form onFinish={(values: any) => send(values)}>
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
        </Form>
    );
}

export default AppointmentForm;
