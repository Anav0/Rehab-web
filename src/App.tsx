import React, { useState } from "react";
import "./App.css";
import {Form, Modal, DatePicker, Button } from "antd";
import localePL from "antd/es/date-picker/locale/pl_PL";
import { Patient } from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import {RootState} from "./store";
import {connect} from "react-redux";
import {Appointment} from "./models/appointment";
import AppointmentForm from "./components/newAppointmentForm";
interface StateProps{
  patients: Patient[],
  appointments: Appointment[]
}
interface DispatchProps {
  addAppointment(appointment: Appointment): void
}

const stateProps = (state: RootState): StateProps => ({
  patients: state.patients.patients,
  appointments: state.appointments.appointments
})

const dispatchProps: DispatchProps = {
  addAppointment: (appointment: Appointment) => ({type: 'ADD_APPOINTMENT', payload: appointment}),
}

type AppProps = StateProps & DispatchProps & {}

const App = (props: AppProps) => {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date("July 28, 2020 07:00"));
  const [isModalVisible, setModalVisibility] = useState<boolean>(false);

  const onWeekChanged = (date: any, dateString: string) => {
    setSelectedDate(new Date(dateString));
  };
  const [form] = Form.useForm();
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
          <Button onClick={()=>setModalVisibility(!isModalVisible)}>Dodaj wizytę</Button>
        </div>
      </div>
      <WeekPlanner
        interval={30}
        startHour={"7:00"}
        endHour={"19:00"}
        selectedDate={selectedDate}
        appointments={props.appointments}
      />
      <Modal closable={false} onOk={() => {
        setModalVisibility(false)
      }} width={1024} visible={isModalVisible} cancelText={"Zamknij"} onCancel={()=>setModalVisibility(false)}>
        <AppointmentForm />
      </Modal>
    </main>
  );
};

export default connect(stateProps,dispatchProps)(App);
