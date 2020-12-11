import {ApiPayload} from "../../models/apiPayload";
import {Referral} from "../../models/referral";
import {api} from "../../api";
import {AppointmentFormData} from "../../models/appointmentFormData";

export const compilePreferences = (values: AppointmentFormData) => {
    let allPreferences: any = [];
    let preference: any = {type: 'time', days: []};
    for (let value of values.times) {
        let day: any = {
            dayOfWeek: +value.day,
            start: value.hourRange[0]._d.toISOString(),
            end: value.hourRange[1]._d.toISOString(),
        };
        preference.days.push(day);
    }
    allPreferences.push(preference);

    return allPreferences;
};

export const schedule = (formData: AppointmentFormData) => {
    if (!formData.patient) throw new Error('Nie wybrano pacjenta');
    let payload = new ApiPayload(
        compilePreferences(formData),
        new Referral(formData.patient, formData.recommendations),
    );
    return api.find.solution(payload);
}