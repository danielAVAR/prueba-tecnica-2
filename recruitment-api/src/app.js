import express from 'express';
import 'dotenv/config';
import { CandidateRepository } from './repositories/candidate.repository.js';
import { VacancyRepository } from './repositories/vacancy.repository.js';
import { ApplicationRepository } from './repositories/application.repository.js';
import { ApplicationService } from './services/application.service.js';
import { ApplicationController } from './controllers/application.controller.js';
import { createApplicationRoutes } from './routes/application.routes.js';

const app = express();
app.use(express.json());

const candidateRepository = new CandidateRepository();
const vacancyRepository = new VacancyRepository();
const applicationRepository = new ApplicationRepository();

const service = new ApplicationService({
  candidateRepository,
  vacancyRepository,
  applicationRepository
});

const controller = new ApplicationController(service);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(createApplicationRoutes(controller));

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(error.status || 500).json({
    error: error.status ? error.message : 'Internal server error'
  });
});

const PORT = Number(process.env.PORT || 3000);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Recruitment API running on http://localhost:${PORT}`);
  });
}

export default app;
