import "./index.css";
import React, {Component, ReactElement} from "react";
import {batch, connect, ConnectedProps} from "react-redux";
import {Patient} from "../../models/patient";
import {RootState} from "../../store";
import {Affix, AutoComplete, Button, Form, InputNumber, notification, Select, Space, Tag, Typography,} from "antd";
import {Treatment} from "../../models/treatment";
import mockedTreatments from "../../mock/treatments";
import {DayAndHour, DayAndHourValue} from "../dayAndHour";
import {MinusCircleOutlined, PlusOutlined, CloseOutlined} from "@ant-design/icons";
import {ApiPayload} from "../../models/apiPayload";
import api from "../../api";
import {copy, parseTimeBlocksFromPayload, Uuid} from "../../helpers";
import {ProximityConstraint, ProximityConstraintState,} from "../proximityConstraint";
import {TimeBlock} from "../../models/timeBlock";
import RecommendationInput from "../recommendationInput";
import {Referral} from "../../models/referral";
import {canAddMoreDays, getPresetBtnsData} from "../../helpers/presets";
import {TimeSection} from "./timeSection";
import {ConstraintsSection} from "./constraintsSection";
import {ProcedureSection} from "./procedureSection";


const {Title} = Typography;
const {Option} = Select;

interface ComponentState {
    selectedPatient: Patient | undefined;
    selectedTreatment: Treatment | undefined;
    filteredPatients: Patient[];
    filteredTreatments: Treatment[];
    isProcessing: boolean;
    selectedConstraints: string[];
    proximityState?: ProximityConstraintState;
    timeSelectorContainerRef: any
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
type AppointmentFormProps = PropsFromRedux & {
    OnSendSuccess: () => void;
};

class AppointmentForm extends Component<AppointmentFormProps, ComponentState> {
    constructor(props: AppointmentFormProps) {
        super(props);

        this.state = {
            selectedPatient: undefined,
            selectedTreatment: undefined,
            filteredPatients: props.patients,
            filteredTreatments: mockedTreatments,
            isProcessing: false,
            selectedConstraints: [],
            proximityState: undefined,
            timeSelectorContainerRef: undefined
        };
    }

    searchPatients = (searchPhrase: string) => {
        searchPhrase = searchPhrase.toLowerCase().trim();
        this.setState((state: ComponentState, props: AppointmentFormProps) => ({
            filteredPatients: props.patients.filter((x: Patient) =>
                x.Name.toLowerCase().includes(searchPhrase)
            ),
        }));
    };

    onPatientSelect = (patientName: string, options: any) => {
        this.setState((state: ComponentState, props: AppointmentFormProps) => ({
            selectedPatient: this.props.patients.find(
                (x: Patient) => x.Name.toLowerCase() === patientName.toLowerCase()
            ),
        }));
    };

    onTreatmentSelected = (treatmentName: string, options: any) => {
        this.setState((state: ComponentState, props: AppointmentFormProps) => ({
            selectedTreatment: mockedTreatments.find(
                (x) => x.Name.toLowerCase() === treatmentName.toLowerCase()
            ),
        }));
    };



    compileConstraints = () => {
        return this.state.proximityState
            ? [
                {
                    type: "proximity",
                    treatment: this.state.proximityState.treatment,
                    offset:
                        this.state.proximityState.offset * this.state.proximityState.sign,
                },
            ]
            : [];
    };

    compilePreferences = (values: any) => {
        let allPreferences: any = [];
        let preference: any = {type: "time", days: []};
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
            if (!this.state.selectedPatient) return;

            let payload = new ApiPayload(
                this.props.timeBlocks,
                this.compilePreferences(values),
                this.compileConstraints(),
                values.numberOfSolutions ?? 1,
                new Referral(this.state.selectedPatient, values.recommendations)
            );
            const response = await api.find.treatment(payload);
            const schedulingResult = response.data;
            let timeBlocks = parseTimeBlocksFromPayload(schedulingResult);
            this.props.bulkTimeBlocksUpdate(timeBlocks);

            let sol = schedulingResult.TreatmentSolutionVariants[0].Solutions[0]
            let blocks: TimeBlock[] = []
            if (sol)
                blocks = sol[0].Blocks

            this.props.OnSendSuccess();

            notification.success({
                message: "Sukces",
                onClick: () => {
                    this.props.updateSelectedDate(new Date(blocks[0].startDate));
                },
                description: (
                    <Space direction="vertical">
            <span>
              {new Date(blocks[0].startDate).toLocaleString("pl", {
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
        } catch (error) {
            let errMsg =
                error.response && error.response.data.error
                    ? error.response.data.error
                    : error.message;

            notification.open({
                message: "Error",
                description: errMsg,
            });
            this.setState((state: ComponentState, props: AppointmentFormProps) => ({
                isProcessing: false,
            }));
        }
    };

    render() {
        return (
            <Form onFinish={(values: any) => this.send(values)}>
                <Title level={3}>Formularz zabiegowy</Title>
                <Form.Item
                    name="patient"
                    rules={[{required: true, message: "Proszę wybrać pacjenta"}]}
                >
                    <AutoComplete
                        placeholder="Wyszukaj pacjenta"
                        onSelect={this.onPatientSelect}
                        onSearch={this.searchPatients}
                    >
                        {this.state.filteredPatients.map((x) => {
                            return (
                                <Option key={Uuid.uuidv4()} value={x.Name}>
                                    {x.Name}
                                </Option>
                            );
                        })}
                    </AutoComplete>
                </Form.Item>
                <TimeSection/>
                <ConstraintsSection/>
                <ProcedureSection/>
                <Title level={4}>Ilość proponowanych rozwiązań</Title>
                <Form.Item name="numberOfSolutions" initialValue={4} required>
                    <InputNumber min={1} max={4}/>
                </Form.Item>
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
