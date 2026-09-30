import pool from '../config/database.js';
import { Candidate } from '../models/Candidate.js';

export class CandidateRepository {
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, years_experience FROM candidates WHERE id = ?',
      [id]
    );
    return rows[0] ? new Candidate(rows[0]) : null;
  }
}
