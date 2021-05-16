import { PropositionPayload } from "../../models/propositionPayload";
import { Referral } from "../../models/referral";
import { api } from "../../api";
import { AppointmentFormData } from "../../models/appointmentFormData";
import { Recommendation } from "../../models/recommendation";

export const compilePreferences = (values: AppointmentFormData) => {
  let allPreferences: any = [];
  let preference: any = { type: "time", days: [] };
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

const flattenRecommendations = (recommendations: Recommendation[]) => {
  let referral: string[] = [];
  for (let i = 0; i < recommendations.length; i++) {
    let recommendation = recommendations[i];
    for (let j = 0; j < recommendation.Repeat; j++) {
      referral.push(recommendation.TreatmentId);
    }
    referral.push();
  }
  return referral;
};

export const schedule = (formData: AppointmentFormData) => {
  if (!formData.patient) throw new Error("Nie wybrano pacjenta");
  //compilePreferences(formData),
  let payload = new PropositionPayload(
    formData.patient.Id,
    flattenRecommendations(formData.recommendations)
  );
  return api.find.solution(payload);
};
