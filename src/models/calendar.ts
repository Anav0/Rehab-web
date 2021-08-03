import type { Term } from "./term"

export class DayModel {
    date: Date;
    placeModelsByPlaceName: Map<string, PlaceModel> = new Map()
}

export class PlaceModel {
    name: string
    terms: Term[] = []
}