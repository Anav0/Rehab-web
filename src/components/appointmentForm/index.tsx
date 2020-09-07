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

const {CheckableTag} = Tag;

const {Title} = Typography;
const {Option} = Select;

interface ComponentState {
    selectedPatient: Patient | undefined;
    selectedTreatment: Treatment | undefined;
    filteredPatients: Patient[];
    filteredTreatments: Treatment[];
    availableDays: any;
    allDays: any;
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

        this.state = {
            selectedPatient: undefined,
            selectedTreatment: undefined,
            filteredPatients: props.patients,
            filteredTreatments: mockedTreatments,
            allDays: JSON.parse(JSON.stringify(days)),
            availableDays: JSON.parse(JSON.stringify(days)),
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

    onSelectedConstraintsChange = (tag: string, checked: boolean) => {
        const {selectedConstraints} = this.state;
        const nextSelectedConstraints = checked
            ? [...selectedConstraints, tag]
            : selectedConstraints.filter((t) => t !== tag);
        this.setState({selectedConstraints: nextSelectedConstraints});
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

    filterDaysByDays = (days: string[]) => {
        let usedDays = this.state.availableDays;
        for (let day of days) {
            if (usedDays[day])
                delete usedDays[day];
        }
        this.setState(() => ({
            availableDays: usedDays,
        }));
    }

    filterDays = (value: DayAndHourValue) => {
        if (!value.day) return;
        let tmp = this.state.availableDays;
        if (value.prevSelectedDay)
            tmp[value.prevSelectedDay] = this.state.allDays[value.prevSelectedDay];

        delete tmp[value.day];
        this.setState(() => ({
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
        const presets = getPresetBtnsData();
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
                <div ref={this.state.timeSelectorContainerRef}>
                    <Title level={4}>Preferowany termin wizyty</Title>
                </div>
                <Form.List name="times">
                    {(fields: any, options: any) => {
                        let canAddMore = canAddMoreDays(fields);
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
                                                    allDays={this.state.allDays}
                                                />
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                style={{marginLeft: "10px"}}
                                                onClick={() => {
                                                    options.remove(field.name);
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                                <Affix target={() => this.state.timeSelectorContainerRef}>
                                    <Space>
                                        <Form.Item>
                                            <Button
                                                disabled={fields.length <= 0}
                                                danger
                                                type="default"
                                                onClick={() => {
                                                }}
                                                block
                                            >
                                                <CloseOutlined/> Wyczyść
                                            </Button>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                disabled={!canAddMore}
                                                type="dashed"
                                                onClick={() => {
                                                    options.add();
                                                }}
                                                block
                                            >
                                                <PlusOutlined/> Dodaj wolny dzień
                                            </Button>
                                        </Form.Item>

                                        {presets.map(presetData => {
                                            const disable = presetData.shouldBeDisabled(options, fields);
                                            return (<Form.Item key={Uuid.uuidv4()}>
                                                <Button
                                                    disabled={disable}
                                                    type="dashed"
                                                    onClick={() => {
                                                        let usedDays = presetData.addDays(options)
                                                        this.filterDaysByDays(usedDays)
                                                    }}
                                                    block
                                                >
                                                    <PlusOutlined/> {presetData.btnTitle}
                                                </Button>
                                            </Form.Item>)
                                        })}
                                    </Space>
                                </Affix>
                            </>
                        );
                    }}
                </Form.List>
                <Title level={4}>Procedury</Title>
                <Form.List name="recommendations">
                    {(fields: any, options: any) => {
                        return (
                            <Space style={{width: '100%'}} direction={"vertical"}>
                                {fields.map((field: any) => {
                                    return (
                                        <Space key={field.key} direction={"horizontal"} align={"baseline"}>
                                            <Form.Item  {...field} fieldKey={field.fieldKey}>
                                                <RecommendationInput treatments={mockedTreatments} onChange={() => {
                                                }}/>
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                style={{marginLeft: "10px"}}
                                                onClick={() => {
                                                    options.remove(field.name);
                                                }}
                                            />
                                        </Space>
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
                                        <PlusOutlined/> Dodaj procedurę
                                    </Button>
                                </Form.Item>
                            </Space>
                        );
                    }}
                </Form.List>
                <Title level={4}>Ograniczenia</Title>
                <Form.Item label="Dostępne ograniczenia">
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
