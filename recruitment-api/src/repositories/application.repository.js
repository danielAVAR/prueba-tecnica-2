import pool from '../config/database.js';

export class ApplicationRepository {
  async findExistingForCandidateAndVacancy(candidateId, vacancyId) {
    const [rows] = await pool.execute(
      `SELECT id, status, status_updated_at
       FROM applications
       WHERE candidate_id = ? AND vacancy_id = ?
       ORDER BY created_at DESC`,
      [candidateId, vacancyId]
    );
    return rows;
  }

  async create(data) {
    const [result] = await pool.execute(
      `INSERT INTO applications
       (candidate_id, vacancy_id, cover_letter, source, score, priority, status)
       VALUES (?, ?, ?, ?, ?, ?, 'RECEIVED')`,
      [
        data.candidateId,
        data.vacancyId,
        data.coverLetter,
        data.source,
        data.score,
        data.priority
      ]
    );
    return this.findById(result.insertId);
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT a.*, c.name AS candidate_name, c.email AS candidate_email,
              v.title AS vacancy_title
       FROM applications a
       JOIN candidates c ON c.id = a.candidate_id
       JOIN vacancies v ON v.id = a.vacancy_id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findAll({ status, vacancyId }) {
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (vacancyId) {
      conditions.push('a.vacancy_id = ?');
      params.push(vacancyId);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT a.*, c.name AS candidate_name, c.email AS candidate_email,
              v.title AS vacancy_title
       FROM applications a
       JOIN candidates c ON c.id = a.candidate_id
       JOIN vacancies v ON v.id = a.vacancy_id
       ${where}
       ORDER BY a.score DESC, a.created_at ASC`,
      params
    );

    return rows;
  }

  async updateStatus(id, status) {
    await pool.execute(
      `UPDATE applications
       SET status = ?, status_updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, id]
    );
    return this.findById(id);
  }
}
