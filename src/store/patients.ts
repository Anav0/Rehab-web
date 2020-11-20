import {Patient} from "../models/patient";
import patients from "../mock/patients";

type PatientsState = {
    patients: Patient[]
}
export const patientsInitState: PatientsState = {
    patients,
}

export const patientActions = {
    insertPatients: (patients: Patient[]) => (operations: any) => {
        operations.setState({
            patients
        });
    },
}
