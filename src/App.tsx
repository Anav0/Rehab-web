import React, { useState } from "react";
import "./App.css";
import { DatePicker } from "antd";
import localePL from "antd/es/date-picker/locale/pl_PL";
import { AutoComplete } from "antd";
import { Patient } from "./models/patient";
import WeekPlanner from "./components/weekPlanner";
import mockPatients from "./mock/patients";
import mockAppointments from "./mock/appointments";

const App = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(
    undefined
  );
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onWeekChanged = (date: any, dateString: string) => {
    setSelectedDate(new Date(dateString));
  };

  const searchPatients = (searchPhrase: string) => {
    searchPhrase = searchPhrase.toLowerCase().trim();
    return setPatients(
      mockPatients.filter((x) => x.name.toLowerCase().includes(searchPhrase))
    );
  };

  const onPatientSelect = (patientName: string, options: any) => {
    const patient: Patient | undefined = mockPatients.find(
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
            options={patients.map((x) => {
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
        appointments={mockAppointments}
      />
    </main>
  );
};

export default App;
