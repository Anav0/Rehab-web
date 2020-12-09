import React, {useEffect, useState} from "react";
import {
    AppHeader,
    AppHeaderActions,
    AppHeaderContent,
    AppHeaderDate,
    AppHeaderProcedures,
    AppHeaderSelectedDate,
    AppLayout
} from "../App.styled";
import {Button, DatePicker, Modal, Spin} from "antd";
import {FrownTwoTone, PlusSquareTwoTone} from "@ant-design/icons";
import localePL from "antd/es/date-picker/locale/pl_PL";
import {MarkBasedOnPatient} from "../components/patient-marker-selector";
import {TreatmentsList} from "../components/treatments-list";
import WeekPlanner from "../components/week-planner";
import {defaultBlocksConfig} from "../models/timeBlockConfig";
import AppointmentForm from "../components/appointment-form";
import {Recommendation} from "../models/recommendation";
import {getMonday, getRandomElement, parseTimeBlocksFromPayload} from "../helpers";
import {Sex} from "../models/patient";
import {ApiPayload} from "../models/apiPayload";
import {Referral} from "../models/referral";
import {api} from "../api";
import {TimeBlock} from "../models/timeBlock";
import {useTimeBlocks} from "../store/timeBlocks";
import {useSelectedDate} from "../store/selectedDate";
import {usePatients} from "../store/patients";
import {useTreatments} from "../store/treatments";
import {BlockPopulator} from "../helpers/blockPopulator";
import {useHistory} from "react-router-dom";
import {RawConstraint} from "../models/RawConstriant";

export const MainPage = () => {
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [unavailableDates, setUnavailableDates] = useState<any>([]);
    const [timeBlocksForSelectedDate, setTimeBlocksForSelectedDate] = useState<TimeBlock[]>([]);
    const [treatmentsConstraints, setTreatmentConstraints] = useState<{ [key: string]: RawConstraint[] }>({});
    const [isFetching, setIsFetching] = useState(true)
    const [{timeBlocks}, {bulkUpdateBlocks}] = useTimeBlocks()
    const [{selectedDate}, {updateSelectedDate}] = useSelectedDate()
    const [{patients}, {changeSelectedPatient, insertPatients}] = usePatients()
    const [{treatments}, {setTreatmentsAndDict}] = useTreatments()
    let history = useHistory();

    const onWeekChanged = (date: any) => {
        updateSelectedDate(date)
    };

    useEffect(() => {
        console.log('Populating blocks');
        (async () => {
            try {
                setIsFetching(true)
                let responseD = await api.patients.all();
                let responseB = await api.treatments.all();
                let responseC = await api.treatments.asDict();
                let responseA = await api.treatments.constraints();
                insertPatients(responseD.data)
                setTreatmentsAndDict(responseB.data, responseC.data)
                setTreatmentConstraints(responseA.data)
                BlockPopulator.populateRandomly(
                    timeBlocks.slice(0, timeBlocks.length / 4), 6, 0.85, responseD.data);
                setIsFetching(false)
            } catch (error) {
                console.error(error)
                history.push('/error/500/Nie-udało-sie-połączyć-z-serwerem')
            }
        })()
    }, []);

    useEffect(() => {
        console.log('App useEffect called');
        let start = getMonday(selectedDate);
        start.setHours(0, 0, 1);
        let end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59);

        let blocks: TimeBlock[] = [];

        for (let block of timeBlocks) {
            let blockDayTime = block.StartDate.getTime();
            if (blockDayTime >= start.getTime() && blockDayTime <= end.getTime()) {
                blocks.push(block);
            }
        }
        setTimeBlocksForSelectedDate(blocks);
    }, [selectedDate, timeBlocks]);


    async function sendTestPayload() {
        let preferences = [
            {
                type: 'time',
                days: [
                    {
                        dayOfWeek: 0,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                    {
                        dayOfWeek: 1,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                    {
                        dayOfWeek: 2,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                    {
                        dayOfWeek: 3,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                    {
                        dayOfWeek: 4,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                    {
                        dayOfWeek: 5,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                    {
                        dayOfWeek: 6,
                        start: '2020-09-02T04:00:00',
                        end: '2020-09-02T14:00:00',
                    },
                ],
            },
        ];

        let recommendations: Recommendation[] = [
            {
                Repeat: 4,
                Treatment: treatments[2],
            },
            {
                Repeat: 4,
                Treatment: treatments[5],
            },
            {
                Repeat: 4,
                Treatment: treatments[1],
            },
            {
                Repeat: 4,
                Treatment: treatments[8],
            },
            {
                Repeat: 4,
                Treatment: treatments[9],
            },
            {
                Repeat: 4,
                Treatment: treatments[6],
            },
        ];
        try {
            setIsTesting(true);
            let patient = getRandomElement(patients);
            console.log(`${patient.Name} ${Sex[patient.Sex]}`);
            let payload = new ApiPayload(
                timeBlocks,
                preferences,
                new Referral(patient, recommendations),
            );
            changeSelectedPatient(patient);
            let response = await api.find.solution(payload);
            let parsedTimeBlocks = parseTimeBlocksFromPayload(response.data);
            bulkUpdateBlocks(parsedTimeBlocks)
        } catch (error) {
            console.error(error);
        } finally {
            setIsTesting(false);
        }
    }

    return (
        <AppLayout>
            <AppHeader>
                <AppHeaderContent
                >
                    <AppHeaderSelectedDate>
                        Wybrana data:{' '}
                        {selectedDate.toLocaleDateString('pl', {
                            day: 'numeric',
                            weekday: 'long',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </AppHeaderSelectedDate>
                    <AppHeaderActions size={"large"} direction={"horizontal"}>
                        <Button icon={<PlusSquareTwoTone/>} onClick={() => setModalVisibility(!isModalVisible)}>
                            Wyznacz zabieg
                        </Button>
                        <Button icon={<FrownTwoTone/>} loading={isTesting} onClick={sendTestPayload}>
                            Test
                        </Button>
                    </AppHeaderActions>
                    <AppHeaderDate size={"large"} align={"center"} direction={"vertical"}>
                        <DatePicker
                            allowClear={false}
                            format={'YYYY-MM-DD'}
                            locale={localePL}
                            onChange={onWeekChanged}
                            picker='week'
                        />
                    </AppHeaderDate>
                    <AppHeaderProcedures size={"large"} direction={"horizontal"}>
                        <MarkBasedOnPatient/>
                        <TreatmentsList
                            treatmentsConstraints={treatmentsConstraints}
                        />
                    </AppHeaderProcedures>
                </AppHeaderContent>
            </AppHeader>
            {!isFetching ? <> <WeekPlanner
                interval={defaultBlocksConfig.durationInMinutes}
                startHour={defaultBlocksConfig.startHour}
                endHour={defaultBlocksConfig.endHour}
                timeBlocks={timeBlocksForSelectedDate}
                selectedDate={selectedDate}
                unavailableDates={unavailableDates}
            />
                <Modal
                    closable={false}
                    onOk={() => {
                        setModalVisibility(false);
                    }}
                    width={1024}
                    visible={isModalVisible}
                    cancelText={'Zamknij'}
                    onCancel={() => setModalVisibility(false)}
                >
                    <AppointmentForm
                        OnSendSuccess={(unavailableDates: any) => {
                            setModalVisibility(false);
                            setUnavailableDates(unavailableDates);
                        }}
                    />
                </Modal></> : <Spin size={'large'} className={'center'} tip="Loading..."/>}
        </AppLayout>
    )
}