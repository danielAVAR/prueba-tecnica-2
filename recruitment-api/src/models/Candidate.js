export class Candidate {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.yearsExperience = Number(data.years_experience);
  }
}
