import React, {useState, useEffect} from "react";
import "./App.css";
import {Modal, DatePicker, Button} from "antd";
import "moment/locale/pl";
import localePL from "antd/es/date-picker/locale/pl_PL";
import {Patient} from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import {RootState} from "./store";
import {connect, ConnectedProps} from "react-redux";
import AppointmentForm from "./components/appointmentForm";
import {TimeBlock} from "./models/timeBlock";
import {defaultBlocksConfig} from "./models/timeBlockConfig";
import {Appointment} from "./models/appointment";
import {ApiPayload} from "./models/apiPayload";
import {Referral} from "./models/referral";
import patients from "./mock/patients";
import {Recommendation} from "./models/recommendation";
import treatments from "./mock/treatments";
import api from "./api";
import {getRandomElement, parseTimeBlocksFromPayload} from "./helpers";

interface StateProps {
    patients: Patient[];
    timeBlocks: TimeBlock[];
    selectedDate: Date;
    appointments: Appointment[];
}

const mapProps = (state: RootState): StateProps => ({
    patients: state.patients.patients,
    timeBlocks: state.timeBlocks.timeBlocks,
    selectedDate: state.selectedDate.selectedDate,
    appointments: state.appointments.appointments,
});

const mapDispatch = {
    updateTimeBlock: (timeblock: TimeBlock) => ({
        type: "UPDATE_TIMEBLOCK",
        payload: timeblock,
    }),
    bulkTimeBlocksUpdate: (timeblocks: TimeBlock[]) => ({
        type: "FILL_TIMEBLOCK",
        payload: timeblocks,
    }),
    updateSelectedDate: (date: Date) => ({
        type: "UPDATE_DATE",
        payload: date,
    }),
};

type AppProps = PropsFromRedux & {};

const connector = connect(mapProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App = (props: AppProps) => {
    const [isModalVisible, setModalVisibility] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [unavailableDates, setUnavailableDates] = useState<any>([]);

    const onWeekChanged = (date: any, dateString: string) => {
        props.updateSelectedDate(new Date(date));
    };

    useEffect(() => {
        console.log("App useEffect called");
    }, [props]);

    async function sendTestPayload() {
        let preferences = [
            {
                type: "time",
                days: [
                    {
                        dayOfWeek: 0, //Niedziela,
                        start: "2020-09-02T06:00:00",
                        end: "2020-09-02T14:00:00",
                    },
                    {
                        dayOfWeek: 6, //Sobota,
                        start: "2020-09-02T10:00:00",
                        end: "2020-09-02T14:00:00",
                    }
                ]
            }

        ]
        let constraints: any = []
        let recommendations: Recommendation[] = [
            {
                repeat: 2,
                treatment: treatments[0]
            },
            {
                repeat: 2,
                treatment: treatments[2]
            },
        ]
        try {
            setIsTesting(true);
            let payload = new ApiPayload(props.timeBlocks, preferences, constraints, 4, new Referral(getRandomElement(patients), recommendations))
            let response = await api.find.treatment(payload);
            let schedulingResult = response.data;
            let timeBlocks = parseTimeBlocksFromPayload(schedulingResult);
            props.bulkTimeBlocksUpdate(timeBlocks);

        } catch (error) {
            console.error(error)
        } finally {
            setIsTesting(false);
        }
    }

    return (
        <main className="layout">
            <div className="app-header">
                <div className="app-header-content app-header-content-column">
          <span className="bold">
            Wybrana data:{" "}
              {props.selectedDate.toLocaleDateString("pl", {
                  day: "numeric",
                  weekday: "long",
                  month: "long",
                  year: "numeric",
              })}
          </span>
                </div>
                <div className="app-header-content">
                    <DatePicker
                        allowClear={false}
                        format={"YYYY-MM-DD"}
                        locale={localePL}
                        onChange={onWeekChanged}
                        picker="week"
                    />
                    <Button onClick={() => setModalVisibility(!isModalVisible)}>
                        Dodaj wizytę
                    </Button>
                    <Button loading={isTesting} onClick={sendTestPayload}>
                        Test
                    </Button>
                </div>
            </div>
            <WeekPlanner
                interval={defaultBlocksConfig.durationInMinutes}
                startHour={defaultBlocksConfig.startHour}
                endHour={defaultBlocksConfig.endHour}
                timeBlocks={props.timeBlocks}
                appointments={props.appointments}
                selectedDate={props.selectedDate}
                unavailableDates={unavailableDates}
            />
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
                <AppointmentForm OnSendSuccess={(unavailableDates: any) => {
                    setModalVisibility(false)
                    setUnavailableDates(unavailableDates)
                }}/>
            </Modal>
        </main>
    );
};

export default connect(mapProps, mapDispatch)(App);
