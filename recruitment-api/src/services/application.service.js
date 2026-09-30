import { HttpError } from '../utils/http-error.js';
import { calculatePriority } from './priority.service.js';

const SOURCES = ['REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER'];
const STATUSES = ['RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED'];
const FINAL_STATUSES = ['REJECTED', 'HIRED'];

export class ApplicationService {
  constructor({ candidateRepository, vacancyRepository, applicationRepository }) {
    this.candidateRepository = candidateRepository;
    this.vacancyRepository = vacancyRepository;
    this.applicationRepository = applicationRepository;
  }

  async create(data) {
    this.validateCreateInput(data);

    if (!SOURCES.includes(data.source)) {
      throw new HttpError(400, `Invalid source. Allowed: ${SOURCES.join(', ')}`);
    }

    const candidate = await this.candidateRepository.findById(data.candidateId);
    if (!candidate) throw new HttpError(404, 'Candidate not found');

    const vacancy = await this.vacancyRepository.findById(data.vacancyId);
    if (!vacancy) throw new HttpError(404, 'Vacancy not found');

    if (vacancy.status !== 'OPEN') {
      throw new HttpError(409, 'The vacancy is CLOSED');
    }

    await this.validateDuplicate(data.candidateId, data.vacancyId);

    const { score, priority } = calculatePriority(candidate, vacancy, data.source);

    return this.applicationRepository.create({
      ...data,
      score,
      priority
    });
  }

  async validateDuplicate(candidateId, vacancyId) {
    const previous = await this.applicationRepository
      .findExistingForCandidateAndVacancy(candidateId, vacancyId);

    if (!previous.length) return;

    const activeOrHired = previous.find(row =>
      ['RECEIVED', 'IN_REVIEW', 'HIRED'].includes(row.status)
    );

    if (activeOrHired) {
      throw new HttpError(
        409,
        `Candidate already has an application in status ${activeOrHired.status}`
      );
    }

    const rejected = previous.find(row => row.status === 'REJECTED');
    if (rejected) {
      const rejectedAt = new Date(rejected.status_updated_at);
      const days = (Date.now() - rejectedAt.getTime()) / 86400000;

      if (days < 30) {
        throw new HttpError(409, 'Candidate can reapply only 30 days after rejection');
      }
    }
  }

  async list(filters) {
    if (filters.status && !STATUSES.includes(filters.status)) {
      throw new HttpError(400, `Invalid status. Allowed: ${STATUSES.join(', ')}`);
    }

    if (filters.vacancyId && !Number.isInteger(Number(filters.vacancyId))) {
      throw new HttpError(400, 'vacancyId must be an integer');
    }

    return this.applicationRepository.findAll({
      status: filters.status,
      vacancyId: filters.vacancyId
    });
  }

  async changeStatus(id, newStatus) {
    if (!STATUSES.includes(newStatus)) {
      throw new HttpError(400, `Invalid status. Allowed: ${STATUSES.join(', ')}`);
    }

    const application = await this.applicationRepository.findById(id);
    if (!application) throw new HttpError(404, 'Application not found');

    if (FINAL_STATUSES.includes(application.status)) {
      throw new HttpError(409, 'Final applications cannot change status');
    }

    return this.applicationRepository.updateStatus(id, newStatus);
  }

  validateCreateInput(data) {
    const required = ['candidateId', 'vacancyId', 'source', 'coverLetter'];

    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new HttpError(400, `${field} is required`);
      }
    }

    if (!Number.isInteger(Number(data.candidateId)) ||
        !Number.isInteger(Number(data.vacancyId))) {
      throw new HttpError(400, 'candidateId and vacancyId must be integers');
    }

    if (typeof data.coverLetter !== 'string') {
      throw new HttpError(400, 'coverLetter must be a string');
    }
  }
}
