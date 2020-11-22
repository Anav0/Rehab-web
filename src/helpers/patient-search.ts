import {Patient} from "../models/patient";

export const filterPatients = (searchPhrase: string, patients: Patient[]) => {
    searchPhrase = searchPhrase.toLowerCase().trim();
    return patients.filter((x: Patient) =>
        x.Name.toLowerCase().includes(searchPhrase),
    )
};