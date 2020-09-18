import {TreatmentSite} from "../models/treatmentSite";
import {Sex} from "../models/patient";

function newSites() {
    const sexConstraintForSiteA: { [key: string]: Sex } = {
        "0": Sex.FEMALE
    }

    return [
        new TreatmentSite(
            "0",
            "Sala gimnastyczna A",
            {"0": {"1": 1}},
            {"0": 2, "1": 4},
            [],
            sexConstraintForSiteA
        ),
        new TreatmentSite("2", "Pokój masażu", {}, {"2": 1}, []),
    ];
}

function newSites2() {
    return [
        new TreatmentSite(
            "0",
            "Sala gimnastyczna B",
            {},
            {"0": 2, "1": 1},
            [],
        ),
        new TreatmentSite("2", "Pokój masażu", {}, {"2": 1}, []),
    ];
}

export const sitesByDay: TreatmentSite[][] = [
    newSites(),
    newSites2(),
    newSites(),
    newSites2(),
    newSites(),
    newSites2(),
    newSites(),
];
