export class Treatment {
  id: string;
  name: string;
  durationInMinutes: number;

  constructor(id: string, name: string, durationInMinutes: number) {
    this.id = id;
    this.name = name;
    this.durationInMinutes = durationInMinutes;
  }
}
