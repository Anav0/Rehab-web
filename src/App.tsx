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
  getNumberInRange,
  getRandomElement,
  parseTimeBlocksFromPayload,
} from "./helpers";
import { TreatmentConstraints } from "./components/treatmentConstraints";
import { treatmentConstraints } from "./mock/treatmentConstraints";
import { TreatmentSite } from "./models/treatmentSite";
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

const connector = connect(mapProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type AppProps = PropsFromRedux & {};

const App = (props: AppProps) => {
  const [isModalVisible, setModalVisibility] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [unavailableDates, setUnavailableDates] = useState<any>([]);
  const [timeBlocksForSelectedDate, setTimeBlocksForSelectedDate] = useState<TimeBlock[]>([]);

  const onWeekChanged = (date: any, dateString: string) => {
    props.updateSelectedDate(new Date(date));
  };

  useEffect(()=>{
    populateBlocks(props.timeBlocks.slice(0,props.timeBlocks.length/4), 5, 0.1);
  },[])

  useEffect(() => {
    console.log("App useEffect called");
    let dayOfMonthStart = props.selectedDate.getDate()-props.selectedDate.getDay();
    let dayOfMonthEnd = dayOfMonthStart+7;
    let month = props.selectedDate.getMonth()
    let year = props.selectedDate.getFullYear()
    let blocks: TimeBlock[]= [];
    for(let block of props.timeBlocks){
      if(block.StartDate.getFullYear()===year && block.StartDate.getMonth()===month){
        let blockDayOfMonth = block.StartDate.getDate();
        if(blockDayOfMonth>=dayOfMonthStart && blockDayOfMonth <= dayOfMonthEnd){
          blocks.push(block)
        }
      }

    }
    setTimeBlocksForSelectedDate(blocks)
  }, [props.selectedDate, props.timeBlocks, props]);

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
        Treatment: treatments[8],
      },
      {
        Repeat: 5,
        Treatment: treatments[4],
      },
      {
        Repeat: 5,
        Treatment: treatments[6],
      },
    ];
    try {
      setIsTesting(true);
      let patient = getRandomElement(patients);
      console.log(patient.Name);
      let payload = new ApiPayload(
        props.timeBlocks,
        preferences,
        new Referral(patient, recommendations),
        treatmentConstraints,
        getAllTreatmentsAsDict()
      );
      let response = await api.find.treatment(payload);
      let schedulingResult = response.data;
      for (let timeBlock of props.timeBlocks) timeBlock.IsNew = false;
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
        timeBlocks={timeBlocksForSelectedDate}
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
export default connector(App);

function populateBlocks(timeBlocks: TimeBlock[], maxAppointPerBlock: number = 4, chances: number = 0.65) {
  for (let i = 0; i < timeBlocks.length; i++) {
    let block = timeBlocks[i];

    if (Math.random() >= chances) {
      let k = getNumberInRange(0,maxAppointPerBlock);
      while (k > 0) {
          let randomSite = getRandomElement(block.Sites) as TreatmentSite;
          let acceptedTreatmentsIds = Object.keys(randomSite.Capacity);
          randomSite.tryAddingAppointment(new Appointment(getRandomElement(acceptedTreatmentsIds), getRandomElement(patients)));
          k--;
        }
      }
  }
}
