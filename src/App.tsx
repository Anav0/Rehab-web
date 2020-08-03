import React, { useState, useEffect } from "react";
import "./App.css";
import { DatePicker } from "antd";
import localePL from "antd/es/date-picker/locale/pl_PL";
import { AutoComplete, Button } from "antd";
import { Patient } from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import {RootState} from "./store";
import {connect} from "react-redux";
import {Appointment} from "./models/appointment";
import mockTreatments from "./mock/treatments"
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

  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(
    undefined
  );
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(props.patients);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("July 28, 2020 07:00"));

  const onWeekChanged = (date: any, dateString: string) => {
    setSelectedDate(new Date(dateString));
  };

  const searchPatients = (searchPhrase: string) => {
    searchPhrase = searchPhrase.toLowerCase().trim();
    return setFilteredPatients(
        props.patients.filter((x) => x.name.toLowerCase().includes(searchPhrase))
    );
  };

  const onPatientSelect = (patientName: string, options: any) => {
    const patient: Patient | undefined = props.patients.find(
      (x) => x.name.toLowerCase() === patientName.toLowerCase()
    );
    setSelectedPatient(patient);
  };

  return (
    <main className="layout">
      <div className="app-header">
        <div className="app-header-content app-header-content-column">
          <span className="bold">
            Wybrany pacjent: {selectedPatient ? selectedPatient.name : "nikogo"}
          </span>
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
          <AutoComplete
            options={filteredPatients.map((x) => {
              return { value: x.name };
            })}
            placeholder="Wyszukaj pacjenta"
            onSelect={onPatientSelect}
            onSearch={searchPatients}
          />
        </div>
      </div>
      <WeekPlanner
        interval={30}
        startHour={"7:00"}
        endHour={"19:00"}
        selectedDate={selectedDate}
        appointments={props.appointments}
      />
    </main>
  );
};

export default connect(stateProps,dispatchProps)(App);
