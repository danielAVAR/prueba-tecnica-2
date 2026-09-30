export class Vacancy {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.minYearsExperience = Number(data.min_years_experience);
    this.status = data.status;
  }
}
