import "./index.css";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import {Patient} from "../../models/patient";
import {RootState} from "../../store";
import {Button, Form, notification, Space, Typography,} from "antd";
import {ApiPayload} from "../../models/apiPayload";
import api from "../../api";
import {parseTimeBlocksFromPayload,} from "../../helpers";
import {TimeBlock} from "../../models/timeBlock";
import {Referral} from "../../models/referral";
import {TimeSection} from "./timeSection";
import {ProcedureSection} from "./procedureSection";
import {PatientSection} from "./patientSection";
import {AppointmentFormData} from "../../models/appointmentFormData";
import {Proximity} from "../proximityConstraint/proximity";
import {UnableSection} from "./unableSection";
import {filterTimeBlocksByDates} from "../../mock/timeBlocks";
import treatments from "../../mock/treatments";
import {treatmentConstraints} from "../../mock/treatmentConstraints";

const {Title} = Typography;

interface ComponentState {
    selectedPatient: Patient | undefined;
    isProcessing: boolean;
    proximityState?: Proximity;
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
    fillBlockedTimeBlocks: (timeBlocks: TimeBlock[]) => ({
        type: "FILL_BLOCKED_TIMEBLOCKS",
        payload: timeBlocks,
    }),
};

const connector = connect(mapProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type AppointmentFormProps = PropsFromRedux & {
    OnSendSuccess: (unavailableDates: any) => void;
};

class AppointmentForm extends Component<AppointmentFormProps, ComponentState> {
    constructor(props: AppointmentFormProps) {
        super(props);
        this.state = {
            selectedPatient: undefined,
            isProcessing: false,
            proximityState: undefined,
        };
    }

    compilePreferences = (values: AppointmentFormData) => {
        let allPreferences: any = [];
        let preference: any = {type: "time", days: []};
        for (let value of values.times) {
            let day: any = {
                dayOfWeek: +value.day,
                start: value.hourRange[0]._d.toISOString(),
                end: value.hourRange[1]._d.toISOString()
            };
            preference.days.push(day);
        }
        allPreferences.push(preference);

        return allPreferences;
    };

    markTimeBlocksAs = (IsNew: boolean) => {
        for (let timeBlock of this.props.timeBlocks)
            timeBlock.IsNew = IsNew;
        this.props.bulkTimeBlocksUpdate(this.props.timeBlocks)
    }

    send = async (formData: AppointmentFormData) => {
        this.setState(() => ({
            isProcessing: true,
        }));
        try {
            if (!formData.patient) throw new Error("Nie wybrano pacjenta");
            this.markTimeBlocksAs(false);


            let payload = new ApiPayload(
                filterTimeBlocksByDates(this.props.timeBlocks, formData.unavailableDates),
                this.compilePreferences(formData),
                new Referral(formData.patient, formData.recommendations),
                treatmentConstraints
            );
            const response = await api.find.treatment(payload);
            const schedulingResult = response.data;
            let timeBlocks = parseTimeBlocksFromPayload(schedulingResult);
            this.props.bulkTimeBlocksUpdate(timeBlocks);

            let sol = schedulingResult.TreatmentSolutionVariants[0].Solutions[0]
            let blocks: TimeBlock[] = []
            if (sol)
                blocks = sol[0].Blocks

            this.props.OnSendSuccess(formData.unavailableDates);

            notification.success({
                message: "Sukces",
                onClick: () => {
                    this.props.updateSelectedDate(new Date(blocks[0].StartDate));
                },
                description: (
                    <Space direction="vertical">
            <span>
              {new Date(blocks[0].StartDate).toLocaleString("pl", {
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
                <PatientSection/>
                <UnableSection/>
                <TimeSection/>
                <ProcedureSection/>
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
