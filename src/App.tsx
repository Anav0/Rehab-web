import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, DatePicker, Modal, Space} from 'antd';
import 'moment/locale/pl';
import localePL from 'antd/es/date-picker/locale/pl_PL';
import {Sex} from './models/patient';
import WeekPlanner from './components/week-planner';
import AppointmentForm from './components/appointment-form';
import {TimeBlock} from './models/timeBlock';
import {defaultBlocksConfig} from './models/timeBlockConfig';
import {ApiPayload} from './models/apiPayload';
import {Referral} from './models/referral';
import {Recommendation} from './models/recommendation';
import api from './api';
import {getAllTreatmentsAsDict, getMonday, getRandomElement, parseTimeBlocksFromPayload,} from './helpers';
import {TreatmentsList} from './components/treatments-list';
import {treatmentConstraints} from './mock/treatmentConstraints';
import {BlockPopulator} from './helpers/blockPopulator';
import {useTimeBlocks} from "./store/timeBlocks";
import {useSelectedDate} from "./store/selectedDate";
import {usePatients} from "./store/patients";
import {MarkBasedOnPatient} from "./components/patient-marker-selector";
import {useMarkers} from "./store/markers";
import {MarkCellsContainingBlocks} from "./helpers/calendar-marking/MarkCellsContainingBlocks";
import {useTreatments} from "./store/treatments";
import {FrownTwoTone, PlusSquareTwoTone} from '@ant-design/icons';

const App = () => {
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [unavailableDates, setUnavailableDates] = useState<any>([]);
    const [timeBlocksForSelectedDate, setTimeBlocksForSelectedDate] = useState<TimeBlock[]>([]);
    const [{timeBlocks}, {bulkUpdateBlocks}] = useTimeBlocks()
    const [{selectedDate}, {updateSelectedDate}] = useSelectedDate()
    const [{patients},] = usePatients()
    const [, {changeMarker}] = useMarkers()
    const [{treatments},] = useTreatments()

    const onWeekChanged = (date: any) => {
        updateSelectedDate(date)
    };

    useEffect(() => {
        console.log('Populating blocks');
        BlockPopulator.populateRandomly(
            timeBlocks.slice(0, timeBlocks.length / 4), 6, 0.85);
        //BlockPopulator.populate(props.timeBlocks.slice(0,props.timeBlocks.length/4))
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
                treatmentConstraints,
                getAllTreatmentsAsDict(),
                {},
            );
            let response = await api.find.solution(payload);
            let parsedTimeBlocks = parseTimeBlocksFromPayload(response.data);
            changeMarker(new MarkCellsContainingBlocks("Nowe wizyty", parsedTimeBlocks))
            bulkUpdateBlocks(parsedTimeBlocks)
        } catch (error) {
            console.error(error);
        } finally {
            setIsTesting(false);
        }
    }

    return (
        <main className='layout'>
            <div className='app-header'>

                <div
                    className='app-header-content'
                >
                     <span className='app-header-selected-date bold'>
                              Wybrana data:{' '}
                         {selectedDate.toLocaleDateString('pl', {
                             day: 'numeric',
                             weekday: 'long',
                             month: 'long',
                             year: 'numeric',
                         })}
                        </span>
                    <Space size={"large"} className='app-header-actions' direction={"horizontal"}>
                        <Button icon={<PlusSquareTwoTone/>} onClick={() => setModalVisibility(!isModalVisible)}>
                            Wyznacz zabieg
                        </Button>
                        <Button icon={<FrownTwoTone/>} loading={isTesting} onClick={sendTestPayload}>
                            Test
                        </Button>
                    </Space>
                    <Space size={"large"} align={"center"} className='app-header-date' direction={"vertical"}>
                        <DatePicker
                            className='app-header-date'
                            allowClear={false}
                            format={'YYYY-MM-DD'}
                            locale={localePL}
                            onChange={onWeekChanged}
                            picker='week'
                        />
                    </Space>

                    <Space size={"large"} className='app-header-procedures' direction={"horizontal"}>
                        <MarkBasedOnPatient/>
                        <TreatmentsList
                            treatments={treatments}
                            treatmentsConstraints={treatmentConstraints}
                        />
                    </Space>
                </div>
            </div>
            <WeekPlanner
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
            </Modal>
        </main>
    );
};
export default App;