import {Patient, Sex} from '../models/patient';
import demo from '../mock/people.json';

const patients = demo.map(patient => new Patient(patient.Name,
    patient.Sex === 'Male' ? Sex.MALE : Sex.FEMALE));

export default patients;
