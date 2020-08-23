import React, { useState } from "react";
import "./App.css";
import { Modal, DatePicker, Button } from "antd";
import "moment/locale/pl";
import localePL from "antd/es/date-picker/locale/pl_PL";

import { Patient } from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import { RootState } from "./store";
import { connect } from "react-redux";
import AppointmentForm from "./components/appointmentForm";
import { TimeBlock } from "./models/timeBlock";
import { defaultBlocksConfig } from "./models/timeBlockConfig";

interface StateProps {
  patients: Patient[];
  timeBlocks: TimeBlock[];
}

const stateProps = (state: RootState): StateProps => ({
  patients: state.patients.patients,
  timeBlocks: state.timeBlocks.timeBlocks,
});

type AppProps = StateProps & {};

const App = (props: AppProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2020, 7, 22));
  const [isModalVisible, setModalVisibility] = useState<boolean>(false);

  const onWeekChanged = (date: any, dateString: string) => {
    setSelectedDate(new Date(dateString));
  };

  return (
    <main className="layout">
      <div className="app-header">
        <div className="app-header-content app-header-content-column">
          <span className="bold">
            Wybrana data:{" "}
            {selectedDate.toLocaleDateString("pl", {
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
        interval={defaultBlocksConfig.duration / 60}
        startHour={defaultBlocksConfig.startHour}
        endHour={defaultBlocksConfig.endHour}
        timeBlocks={props.timeBlocks}
        selectedDate={selectedDate}
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

export default connect(stateProps, {})(App);
