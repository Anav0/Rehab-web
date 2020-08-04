import "./index.css"
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Patient} from "../../models/patient";
import {Appointment} from "../../models/appointment";
import {RootState} from "../../store";
import {AutoComplete, Button, Form, Select, Typography} from "antd";
import {Treatment} from "../../models/treatment";
import mockedTreatments from "../../mock/treatments";
import {DayAndHour, DayAndHourValue} from "../dayAndHour";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {ConstraintType} from "../../models/constraints/baseConstraint";
import {SizeConstraint} from "../../models/constraints/sizeConstraint";
import {ApiPayload} from "../../models/apiPayload";
import api from "../../api";
import {Uuid} from "../../helpers";

interface HashTable<T> {
    [key: string]: T;
}

const {Text, Title} = Typography;

const {Option} = Select;

interface StateProps {
    patients: Patient[],
    appointments: Appointment[],
    formInst: any
}

interface DispatchProps {
}

interface ComponentState {
    selectedPatient: Patient | undefined,
    selectedTreatment: Treatment | undefined,
    filteredPatients: Patient[],
    filteredTreatments: Treatment[],
    availableDays: HashTable<string>,
    allDays: HashTable<string>,
    isProcessing: boolean
}

const stateProps = (state: RootState): StateProps => ({
    patients: state.patients.patients,
    appointments: state.appointments.appointments,
    formInst: undefined
})

const dispatchProps: DispatchProps = {
    addAppointment: (appointment: Appointment) => ({type: 'ADD_APPOINTMENT', payload: appointment}),
}

class AppointmentForm extends Component<StateProps, ComponentState> {

    constructor(props: StateProps) {
        super(props);
        this.state = {
            selectedPatient: undefined,
            selectedTreatment: undefined,
            filteredPatients: props.patients,
            filteredTreatments: mockedTreatments,
            allDays: {"0":"Niedziela", "1":"Poniedziałek", "2":"Wtorek", "3":"Środa", "4":"Czwartek", "5":"Piątek", "6":"Sobota"},
            availableDays: {"0":"Niedziela", "1":"Poniedziałek", "2":"Wtorek", "3":"Środa", "4":"Czwartek", "5":"Piątek", "6":"Sobota"},
            isProcessing: false
        }
    }

    searchPatients = (searchPhrase: string) => {
        searchPhrase = searchPhrase.toLowerCase().trim();
        this.setState((state: ComponentState, props: StateProps) => ({
            filteredPatients: props.patients.filter((x) => x.name.toLowerCase().includes(searchPhrase))
        }))
    };

    onPatientSelect = (patientName: string, options: any) => {
        this.setState((state: ComponentState, props: StateProps) => ({
            selectedPatient: this.props.patients.find(
                (x) => x.name.toLowerCase() === patientName.toLowerCase()
            )
        }))
    };

    searchTreatments = (searchPhrase: string) => {
        searchPhrase = searchPhrase.toLowerCase().trim();
        this.setState((state: ComponentState, props: StateProps) => ({
            filteredTreatments: mockedTreatments.filter((x) => x.name.toLowerCase().includes(searchPhrase))
        }))
    };

    onTreatmentSelected = (treatmentName: string, options: any) => {
        this.setState((state: ComponentState, props: StateProps) => ({
            selectedTreatment: mockedTreatments.find(
                (x) => x.name.toLowerCase() === treatmentName.toLowerCase()
            )
        }))
    };

     send = async (values: any) => {
         this.setState((state: ComponentState, props: StateProps) => ({
             isProcessing: true
         }))
         try{

        let today = new Date()
        let searchStart = today.toISOString();
        today.setDate(today.getDate()+365);
        let searchEnd = today.toISOString()

        let existingAppointments = this.props.appointments;
        let appointmentConstraints = []

        let i = 0;
        for(let appointment of existingAppointments){

            let k=0;
            for(let constraint of appointment.constraints){
                let adHog: any = {
                    index: i,
                    type: constraint.type as number
                }
                if(constraint.type == ConstraintType.SIZE){
                    let casted = constraint as SizeConstraint
                    adHog['size'] = casted.size
                }
                appointmentConstraints.push(adHog)
            }
            k++;

            i++;
        }

        let allPreferences: any = []
        let preference: any = { type: 0, days: []}
        for(let value of values.times){
            let day: any = {
                dayOfWeek: +value.day,
            }

            let startDate = value.hourRange[0]._d.toISOString();
            let endDate = value.hourRange[1]._d.toISOString();
            if(startDate===endDate)
                day['hour'] = startDate
                else
                    day['timeRange'] = {
                    start: startDate,
                    end: endDate
                    }
            preference.days.push(day)
        }
         allPreferences.push(preference)

        let patientWish: any = {
            patient: this.state.selectedPatient,
            treatment: this.state.selectedTreatment,
            treatmentConstraints: []
        }

        let payload = new ApiPayload(searchStart,searchEnd,existingAppointments,appointmentConstraints,allPreferences,patientWish)
        console.log(payload)

        const response = await api.find.treatment(payload)
         console.log(process.env.REACT_APP_API_URL);

         this.setState((state: ComponentState, props: StateProps) => ({
         isProcessing: false
     }))
        console.log(response)
         }catch(error){
             console.error(error.message)
             this.setState((state: ComponentState, props: StateProps) => ({
                 isProcessing: false
             }))
         }
     }

    filterDays = (values: DayAndHourValue) =>{
        if(!values.day) return;
        let tmp = this.state.availableDays
        delete tmp[values.day]
        this.setState((state,props)=>({
            availableDays: tmp
        }))
    }

    addDay = (values: DayAndHourValue) => {
        if(!values.day)return;
        console.log(this.state.availableDays)
        let tmp = this.state.availableDays
        tmp[values.day] = this.state.allDays[values.day];
        console.log(tmp)
        this.setState((state,props)=>({
            availableDays: tmp
        }))
    }

    render() {
        return (
            <Form form={this.props.formInst} onFinish={(values: any) => this.send(values)}>
                <Title level={3}>Wybierz pacjenta oraz zabieg</Title>
                <Form.Item
                    name="patient"
                    rules={[{required: true, message: 'Proszę wybrać pacjenta'}]}
                >
                    <AutoComplete
                        options={this.state.filteredPatients.map((x) => {
                            return {value: x.name};
                        })}
                        placeholder="Wyszukaj pacjenta"
                        onSelect={this.onPatientSelect}
                        onSearch={this.searchPatients}
                    />
                </Form.Item>
                <Form.Item
                    name="treatment"
                    rules={[{required: true, message: 'Proszę wybrać zabieg'}]}
                >
                    <AutoComplete
                        options={this.state.filteredTreatments.map((x) => {
                            return {value: x.name};
                        })}
                        placeholder="Wyszukaj zabieg"
                        onSelect={this.onTreatmentSelected}
                        onSearch={this.searchTreatments}
                    />
                </Form.Item>
                <Title level={4} >Preferowany termin wizyty</Title>
                <Form.List name="times">
                    {(fields: any, options: any) => {
                        return (
                            <>
                                {fields.map((field: any) => {
                                    return (
                                        <div key={Uuid.uuidv4()} className={'day-preference'}>
                                            <Form.Item
                                                {...field}
                                                name={field.name}
                                                fieldKey={field.fieldKey}>
                                                <DayAndHour onUnmount={(values: DayAndHourValue)=>this.addDay(values)} onChange={(values: DayAndHourValue)=>this.filterDays(values)} days={this.state.availableDays}/>
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                style={{marginLeft: '10px'}}
                                                onClick={() => {
                                                    options.remove(field.name);
                                                }}
                                            />
                                        </div>
                                    )

                                })}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            options.add();
                                        }}
                                        block
                                    >
                                        <PlusOutlined/> Dodaj wolny dzień
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
                <Form.Item >
                    <Button loading={this.state.isProcessing} type="primary" htmlType="submit">
                        Wyślij
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default connect(stateProps, dispatchProps)(AppointmentForm);
