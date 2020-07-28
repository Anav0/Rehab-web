import { Uuid } from "../helpers";

export class Patient {
  id: string;
  name: string;
  sex: Sex;

  constructor(name: string, sex: Sex) {
    this.id = Uuid.uuidv4();
    this.name = name;
    this.sex = sex;
  }
}

export enum Sex {
  MALE = 0,
  FEMALE = 1,
}
