import pool from '../config/database.js';
import { Vacancy } from '../models/Vacancy.js';

export class VacancyRepository {
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, title, min_years_experience, status FROM vacancies WHERE id = ?',
      [id]
    );
    return rows[0] ? new Vacancy(rows[0]) : null;
  }
}
