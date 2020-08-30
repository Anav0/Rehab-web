import React, { useState, useEffect } from "react";
import "./App.css";
import { Modal, DatePicker, Button } from "antd";
import "moment/locale/pl";
import localePL from "antd/es/date-picker/locale/pl_PL";

import { Patient } from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import { RootState } from "./store";
import { connect, ConnectedProps } from "react-redux";
import AppointmentForm from "./components/appointmentForm";
import { TimeBlock } from "./models/timeBlock";
import { defaultBlocksConfig } from "./models/timeBlockConfig";
import { Appointment } from "./models/appointment";
import treatments from "./mock/treatments";
import patients from "./mock/patients";

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
  const onWeekChanged = (date: any, dateString: string) => {
    props.updateSelectedDate(new Date(date));
  };

  useEffect(() => {
    console.log("TTTTTT");

    // var timeblock = props.timeBlocks[0];
    // timeblock.sites[0].appointments.push(
    //   new Appointment(treatments[0], patients[0])
    // );
    // props.updateTimeBlock(timeblock);
  }, [props]);

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
        </div>
      </div>
      <WeekPlanner
        interval={defaultBlocksConfig.durationInMinutes}
        startHour={defaultBlocksConfig.startHour}
        endHour={defaultBlocksConfig.endHour}
        timeBlocks={props.timeBlocks}
        appointments={props.appointments}
        selectedDate={props.selectedDate}
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
        <AppointmentForm OnSendSuccess={() => setModalVisibility(false)} />
      </Modal>
    </main>
  );
};

export default connect(mapProps, mapDispatch)(App);
