export class Treatment {
  id: string;
  name: string;
  durationInSeconds: number;

  constructor(id: string, name: string, durationInSeconds: number) {
    this.id = id;
    this.name = name;
    this.durationInSeconds = durationInSeconds;
  }
}
