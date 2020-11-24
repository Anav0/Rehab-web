import {Patient} from './patient';
import {Recommendation} from './recommendation';
import {Proximity} from '../components/proximity-constraint/proximity';
import {TimePreference} from './timePreference';

export interface AppointmentFormData {
    patient: Patient,
    numberOfSolutions: number,
    proximity: Proximity | undefined,
    times: TimePreference[],
    recommendations: Recommendation[]
    unavailableDates: any[][]
}