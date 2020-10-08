import React, { useState, useEffect } from "react";
import "./App.css";
import { Modal, DatePicker, Button, Space } from "antd";
import "moment/locale/pl";
import localePL from "antd/es/date-picker/locale/pl_PL";
import { Patient } from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import { RootState } from "./store";
import { connect, ConnectedProps } from "react-redux";
import AppointmentForm from "./components/appointmentForm";
import { TimeBlock } from "./models/timeBlock";
import { defaultBlocksConfig } from "./models/timeBlockConfig";
import { ApiPayload } from "./models/apiPayload";
import { Referral } from "./models/referral";
import patients from "./mock/patients";
import { Recommendation } from "./models/recommendation";
import treatments from "./mock/treatments";
import api from "./api";
import {
  getAllTreatmentsAsDict,
  getRandomElement,
  parseTimeBlocksFromPayload,
} from "./helpers";
import { TreatmentConstraints } from "./components/treatmentConstraints";
import { treatmentConstraints } from "./mock/treatmentConstraints";
import { updateTimeblock } from "./store/timeblocks/actions";
import { Appointment } from "./models/appointment";

interface StateProps {
  patients: Patient[];
  timeBlocks: TimeBlock[];
  selectedDate: Date;
}

const mapProps = (state: RootState): StateProps => ({
  patients: state.patients.patients,
  timeBlocks: state.timeBlocks.timeBlocks,
  selectedDate: state.selectedDate.selectedDate,
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
    // let initId = 10;
    // for (let i = 10; i > 0; i--) {
    //   let newId = Math.round(initId + Math.random() * 20);
    //   props.timeBlocks[newId].Sites[3].tryAddingAppointment(
    //     new Appointment("3", patients[0])
    //   );
    //   updateTimeblock(props.timeBlocks[initId]);
    // }
  }, [props]);

  async function sendTestPayload() {
    let preferences = [
      {
        type: "time",
        days: [
          {
            dayOfWeek: 0,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
          {
            dayOfWeek: 1,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
          {
            dayOfWeek: 2,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
          {
            dayOfWeek: 3,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
          {
            dayOfWeek: 4,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
          {
            dayOfWeek: 5,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
          {
            dayOfWeek: 6,
            start: "2020-09-02T04:00:00",
            end: "2020-09-02T14:00:00",
          },
        ],
      },
    ];

    let recommendations: Recommendation[] = [
      {
        Repeat: 5,
        Treatment: treatments[3],
      },
      {
        Repeat: 5,
        Treatment: treatments[4],
      },
      {
        Repeat: 10,
        Treatment: treatments[9],
      },
    ];
    try {
      setIsTesting(true);
      let payload = new ApiPayload(
        props.timeBlocks,
        preferences,
        new Referral(getRandomElement(patients), recommendations),
        treatmentConstraints,
        getAllTreatmentsAsDict()
      );
      let response = await api.find.treatment(payload);
      let schedulingResult = response.data;
      let timeBlocks = parseTimeBlocksFromPayload(schedulingResult);
      props.bulkTimeBlocksUpdate(timeBlocks);
    } catch (error) {
      console.error(error);
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
        <Space
          direction={"horizontal"}
          size={"large"}
          className="app-header-content"
        >
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
          <TreatmentConstraints
            treatments={treatments}
            treatmentsConstraints={treatmentConstraints}
          />
        </Space>
      </div>
      <WeekPlanner
        interval={defaultBlocksConfig.durationInMinutes}
        startHour={defaultBlocksConfig.startHour}
        endHour={defaultBlocksConfig.endHour}
        timeBlocks={props.timeBlocks}
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
export default connect(mapProps, mapDispatch)(App);
