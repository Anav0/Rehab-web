import "./index.css";
import React, { Component, ReactElement } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Patient } from "../../models/patient";
import { Appointment } from "../../models/appointment";
import { RootState } from "../../store";
import {
  AutoComplete,
  Button,
  Form,
  Select,
  notification,
  Typography,
  Space,
} from "antd";
import { Treatment } from "../../models/treatment";
import mockedTreatments from "../../mock/treatments";
import { DayAndHour, DayAndHourValue } from "../dayAndHour";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ApiPayload } from "../../models/apiPayload";
import api from "../../api";
import { Uuid } from "../../helpers";
import { Tag } from "antd";
import {
  ProximityConstraint,
  ProximityConstraintState,
} from "../proximityConstraint";
import { TimeBlock } from "../../models/timeBlock";
import { updateTimeblock } from "../../store/timeblocks/actions";
import { getTimeBlockRange } from "../../mock/timeBlocks";
import { defaultBlocksConfig } from "../../models/timeBlockConfig";
const { CheckableTag } = Tag;

interface HashTable<T> {
  [key: string]: T;
}
const { Title } = Typography;
const { Option } = Select;

interface ComponentState {
  selectedPatient: Patient | undefined;
  selectedTreatment: Treatment | undefined;
  filteredPatients: Patient[];
  filteredTreatments: Treatment[];
  availableDays: HashTable<string>;
  allDays: HashTable<string>;
  isProcessing: boolean;
  selectedConstraints: string[];
  proximityState?: ProximityConstraintState;
}

type ComponentProps = {
  patients: Patient[];
  timeBlocks: TimeBlock[];
};

const mapProps = (state: RootState): ComponentProps => ({
  patients: state.patients.patients,
  timeBlocks: state.timeBlocks.timeBlocks,
});

const mapDispatch = {
  updateTimeBlock: (timeblock: TimeBlock) => ({
    type: "UPDATE_TIMEBLOCK",
    payload: timeblock,
  }),
};

const connector = connect(mapProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type AppointmentFormProps = PropsFromRedux & {
  OnSendSuccess: () => void;
};

const days = {
  "0": "Niedziela",
  "1": "Poniedziałek",
  "2": "Wtorek",
  "3": "Środa",
  "4": "Czwartek",
  "5": "Piątek",
  "6": "Sobota",
};

class AppointmentForm extends Component<AppointmentFormProps, ComponentState> {
  constructor(props: AppointmentFormProps) {
    super(props);
    console.log(props);

    this.state = {
      selectedPatient: undefined,
      selectedTreatment: undefined,
      filteredPatients: props.patients,
      filteredTreatments: mockedTreatments,
      allDays: days,
      availableDays: days,
      isProcessing: false,
      selectedConstraints: [],
      proximityState: undefined,
    };
  }

  searchPatients = (searchPhrase: string) => {
    searchPhrase = searchPhrase.toLowerCase().trim();
    this.setState((state: ComponentState, props: AppointmentFormProps) => ({
      filteredPatients: props.patients.filter((x: any) =>
        x.name.toLowerCase().includes(searchPhrase)
      ),
    }));
  };

  onPatientSelect = (patientName: string, options: any) => {
    this.setState((state: ComponentState, props: AppointmentFormProps) => ({
      selectedPatient: this.props.patients.find(
        (x: any) => x.name.toLowerCase() === patientName.toLowerCase()
      ),
    }));
  };

  searchTreatments = (searchPhrase: string) => {
    searchPhrase = searchPhrase.toLowerCase().trim();
    this.setState((state: ComponentState, props: AppointmentFormProps) => ({
      filteredTreatments: mockedTreatments.filter((x) =>
        x.name.toLowerCase().includes(searchPhrase)
      ),
    }));
  };

  onTreatmentSelected = (treatmentName: string, options: any) => {
    this.setState((state: ComponentState, props: AppointmentFormProps) => ({
      selectedTreatment: mockedTreatments.find(
        (x) => x.name.toLowerCase() === treatmentName.toLowerCase()
      ),
    }));
  };

  onSelectedConstraintsChange = (tag: string, checked: boolean) => {
    const { selectedConstraints } = this.state;
    const nextSelectedConstraints = checked
      ? [...selectedConstraints, tag]
      : selectedConstraints.filter((t) => t !== tag);
    this.setState({ selectedConstraints: nextSelectedConstraints });
  };

  compileConstraints = (values: any) => {
    return this.state.proximityState
      ? [
          {
            type: "proximity",
            offset:
              this.state.proximityState.offset * this.state.proximityState.sign,
          },
        ]
      : [];
  };

  compilePreferences = (values: any) => {
    let allPreferences: any = [];
    let preference: any = { type: "time", days: [] };
    for (let value of values.times) {
      let day: any = {
        dayOfWeek: +value.day,
      };
      day["start"] = value.hourRange[0]._d.toISOString();
      day["end"] = value.hourRange[1]._d.toISOString();
      preference.days.push(day);
    }
    allPreferences.push(preference);

    return allPreferences;
  };

  send = async (values: any) => {
    this.setState((state: ComponentState, props: AppointmentFormProps) => ({
      isProcessing: true,
    }));
    try {
      let patientWish: any = {
        patient: this.state.selectedPatient,
        treatment: this.state.selectedTreatment,
      };

      let now = new Date();
      console.log(now);
      let then = new Date();
      then.setDate(now.getDate() + defaultBlocksConfig.endSearchAfterDays);

      let payload = new ApiPayload(
        getTimeBlockRange(now, then, this.props.timeBlocks),
        this.compileConstraints(values),
        this.compilePreferences(values),
        patientWish
      );

      const response = await api.find.treatment(payload);

      let block = response.data.block;

      this.props.updateTimeBlock(
        new TimeBlock(
          new Date(block.start),
          block.durationInSeconds,
          block.sites
        )
      );

      await updateTimeblock(block);
      this.props.OnSendSuccess();

      notification.open({
        message: "Sukces",
        description: (
          <Space direction="vertical">
            <span>
              {new Date(block.start).toLocaleString("pl", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </Space>
        ),
      });

      this.setState((state: ComponentState, props: AppointmentFormProps) => ({
        isProcessing: false,
      }));
      console.log(response);
    } catch (error) {
      console.error(error.message);
      notification.open({
        message: "Error",
        description: error.message,
      });
      this.setState((state: ComponentState, props: AppointmentFormProps) => ({
        isProcessing: false,
      }));
    }
  };

  filterDays = (values: DayAndHourValue) => {
    if (!values.day) return;
    let tmp = this.state.availableDays;
    if (values.prevSelectedDay)
      tmp[values.prevSelectedDay] = this.state.allDays[values.prevSelectedDay];
    delete tmp[values.day];
    this.setState((state, props) => ({
      availableDays: tmp,
    }));
  };

  addDay = (values: DayAndHourValue) => {
    if (!values.day) return;
    let tmp = this.state.availableDays;
    tmp[values.day] = this.state.allDays[values.day];
    this.setState((state, props) => ({
      availableDays: tmp,
    }));
  };

  onProximityConstraintChange = (info?: ProximityConstraintState) => {
    this.setState((state, props) => ({
      proximityState: info,
    }));
  };

  render() {
    let constraintsUI: { [key: string]: ReactElement } = {
      odległość: (
        <Form.Item name="proximity" key="form-proximity-part">
          <ProximityConstraint
            onValueChanged={this.onProximityConstraintChange}
          />
        </Form.Item>
      ),
    };

    return (
      <Form onFinish={(values: any) => this.send(values)}>
        <Title level={3}>Wybierz pacjenta oraz zabieg</Title>
        <Form.Item
          name="patient"
          rules={[{ required: true, message: "Proszę wybrać pacjenta" }]}
        >
          <AutoComplete
            placeholder="Wyszukaj pacjenta"
            onSelect={this.onPatientSelect}
            onSearch={this.searchPatients}
          >
            {this.state.filteredPatients.map((x) => {
              return (
                <Option key={Uuid.uuidv4()} value={x.name}>
                  {x.name}
                </Option>
              );
            })}
          </AutoComplete>
        </Form.Item>
        <Form.Item
          name="treatment"
          rules={[{ required: true, message: "Proszę wybrać zabieg" }]}
        >
          <AutoComplete
            placeholder="Wyszukaj zabieg"
            onSelect={this.onTreatmentSelected}
            onSearch={this.searchTreatments}
          >
            {this.state.filteredTreatments.map((x) => {
              return (
                <Option key={Uuid.uuidv4()} value={x.name}>
                  {x.name}
                </Option>
              );
            })}
          </AutoComplete>
        </Form.Item>
        <Title level={4}>Preferowany termin wizyty</Title>
        <Form.List name="times">
          {(fields: any, options: any) => {
            return (
              <>
                {fields.map((field: any) => {
                  return (
                    <div key={field.key} className={"day-preference"}>
                      <Form.Item {...field} fieldKey={field.fieldKey}>
                        <DayAndHour
                          onUnmount={(values: DayAndHourValue) =>
                            this.addDay(values)
                          }
                          onChange={(values: DayAndHourValue) =>
                            this.filterDays(values)
                          }
                          days={this.state.availableDays}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          options.remove(field.name);
                        }}
                      />
                    </div>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      options.add();
                    }}
                    block
                  >
                    <PlusOutlined /> Dodaj wolny dzień
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        <Title level={4}>Ograniczenia</Title>
        <Form.Item name="constraints" label="Dostępne ograniczenia">
          {Object.keys(constraintsUI).map((x) => {
            return (
              <CheckableTag
                key={Uuid.uuidv4()}
                checked={this.state.selectedConstraints.indexOf(x) > -1}
                onChange={(checked) =>
                  this.onSelectedConstraintsChange(x, checked)
                }
              >
                {x}
              </CheckableTag>
            );
          })}
        </Form.Item>
        {this.state.selectedConstraints.map((x) => {
          return constraintsUI[x];
        })}
        <Form.Item>
          <Button
            loading={this.state.isProcessing}
            type="primary"
            htmlType="submit"
          >
            Wyślij
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connector(AppointmentForm);
