export class Treatment {
  Id: string;
  Name: string;
  DurationInMinutes: number;

  constructor(id: string, name: string, durationInMinutes: number) {
    this.Id = id;
    this.Name = name;
    this.DurationInMinutes = durationInMinutes;
  }
}
