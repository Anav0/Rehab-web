import React, {useEffect, useState} from "react";
import {
    AppHeader,
    AppHeaderActions,
    AppHeaderContent,
    AppHeaderDate,
    AppHeaderProcedures,
    AppHeaderSelectedDate,
    AppLayout,
} from "../App.styled";
import {Button, DatePicker, Modal, Spin} from "antd";
import {FrownTwoTone, PlusSquareTwoTone} from "@ant-design/icons";
import localePL from "antd/es/date-picker/locale/pl_PL";
import {MarkBasedOnPatient} from "../components/patient-marker-selector";
import {TreatmentsList} from "../components/treatments-list";
import WeekPlanner from "../components/week-planner";
import {defaultBlocksConfig} from "../models/timeBlockConfig";
import AppointmentForm from "../components/appointment-form";
import {getMonday, getRandomElement, parseTimeBlocks} from "../helpers";
import {Sex} from "../models/patient";
import {PropositionPayload} from "../models/propositionPayload";
import {api} from "../api";
import {TimeBlock} from "../models/timeBlock";
import {useSelectedDate} from "../store/selectedDate";
import {usePatients} from "../store/patients";
import {useTreatments} from "../store/treatments";
import {useHistory} from "react-router-dom";
import {RawConstraint} from "../models/RawConstriant";
import {BlocksRangePayload} from "../models/BlocksRangePayload";
import {useProposition} from "../store/proposition";
import {PropositionsTracker} from "../components/propositions-tracker";

export const MainPage = () => {
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [unavailableDates, setUnavailableDates] = useState<any>([]);
    const [timeBlocksForSelectedDate, setTimeBlocksForSelectedDate] = useState<TimeBlock[]>([]);
    const [treatmentsConstraints, setTreatmentConstraints] = useState<Map<string, RawConstraint[]>>(new Map());
    const [hideCalendar, setHideCalendar] = useState(true);
    const [{selectedDate}, {updateSelectedDate}] = useSelectedDate();
    const [{patients}, {changeSelectedPatient, insertPatients}] =
        usePatients();
    const [{treatments}, {setTreatmentsAndDict}] = useTreatments();
    const [{proposition}, {setProposition}] = useProposition();
    let history = useHistory();

    const onWeekChanged = (date: any) => {
        updateSelectedDate(date);
    };

    useEffect(() => {
        console.log("Fetching basic info...");
        (async () => {
            try {
                let responseD = await api.patients.all();
                let responseB = await api.treatments.all();
                let responseC = await api.treatments.asDict();
                let responseA = await api.treatments.constraints();
                insertPatients(responseD.data);
                setTreatmentsAndDict(responseB.data, responseC.data);
                setTreatmentConstraints(responseA.data);
            } catch (error) {
                console.error(error);
                history.push("/error/500/Nie-udało-sie-połączyć-z-serwerem");
            }
        })();
    }, []);

    useEffect(() => {
        setHideCalendar(
            treatments.length <= 0 ||
            treatmentsConstraints.size <= 0 ||
            timeBlocksForSelectedDate.length <= 0
        );
    }, [treatments, treatmentsConstraints, timeBlocksForSelectedDate]);

    useEffect(() => {
        setHideCalendar(true);
        let start = getMonday(selectedDate);
        start.setHours(0, 0, 1);
        let end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59);
        console.log(
            `Fetching blocks for: ${start.toLocaleString()} - ${end.toLocaleString()}`
        );

        (async () => {
            try {
                console.log("Fetching blocks...");
                const response = await api.blocks.range(
                    new BlocksRangePayload(start.toISOString(), end.toISOString())
                );

                setTimeBlocksForSelectedDate(parseTimeBlocks(response.data));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [selectedDate]);

    async function sendTestPayload() {
        try {
            setIsTesting(true);
            let patient = getRandomElement(patients);
            console.log(`${patient.Name} ${Sex[patient.Sex]}`);
            let payload = new PropositionPayload(patient.Id, ["0", "1"]);
            changeSelectedPatient(patient);
            let result = await api.find.solution(payload);
            setProposition(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTesting(false);
        }
    }

    return (
        <AppLayout>
            <AppHeader>
                <AppHeaderContent>
                    <AppHeaderSelectedDate>
                        Wybrana data:{" "}
                        {selectedDate.toLocaleDateString("pl", {
                            day: "numeric",
                            weekday: "long",
                            month: "long",
                            year: "numeric",
                        })}
                    </AppHeaderSelectedDate>
                    <AppHeaderActions size={"large"} direction={"horizontal"}>
                        <Button
                            icon={<PlusSquareTwoTone/>}
                            onClick={() => setModalVisibility(!isModalVisible)}
                        >
                            Wyznacz zabieg
                        </Button>
                        <Button
                            icon={<FrownTwoTone/>}
                            loading={isTesting}
                            onClick={sendTestPayload}
                        >
                            Test
                        </Button>
                    </AppHeaderActions>
                    <AppHeaderDate size={"large"} align={"center"} direction={"vertical"}>
                        <DatePicker
                            allowClear={false}
                            format={"YYYY-MM-DD"}
                            locale={localePL}
                            onChange={onWeekChanged}
                            picker="week"
                        />
                    </AppHeaderDate>
                    <AppHeaderProcedures size={"large"} direction={"horizontal"}>
                        <MarkBasedOnPatient/>
                        <TreatmentsList treatmentsConstraints={treatmentsConstraints}/>
                    </AppHeaderProcedures>
                </AppHeaderContent>
            </AppHeader>
            {!hideCalendar ? (
                <>
                    <WeekPlanner
                        selectedDate={selectedDate}
                        startHour={defaultBlocksConfig.startHour}
                        endHour={defaultBlocksConfig.endHour}
                        timeBlocks={timeBlocksForSelectedDate}
                    />
                    {proposition && proposition.ScheduledDates.length > 0 ? (
                        <PropositionsTracker/>
                    ) : (
                        <></>
                    )}
                    <Modal
                        closable={false}
                        onOk={() => {
                            setModalVisibility(false);
                        }}
                        width={1024}
                        visible={isModalVisible}
                        cancelText={"Zamknij"}
                        onCancel={() => setModalVisibility(false)}
                    >
                        <AppointmentForm
                            OnSendSuccess={(unavailableDates: any) => {
                                setModalVisibility(false);
                                setUnavailableDates(unavailableDates);
                            }}
                        />
                    </Modal>
                </>
            ) : (
                <Spin size={"large"} className={"center"} tip="Loading..."/>
            )}
        </AppLayout>
    );
};
