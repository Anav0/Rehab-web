import { Uuid } from "../helpers/uuid";

export class Patient {
  Id: string;
  Name: string;
  Sex: Sex;

  constructor(name: string, sex: Sex) {
    this.Id = Uuid.uuidv4();
    this.Name = name;
    this.Sex = sex;
  }
}

export enum Sex {
  MALE = 0,
  FEMALE = 1,
}
