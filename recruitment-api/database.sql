CREATE DATABASE IF NOT EXISTS recruitment_api
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE recruitment_api;

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS vacancies;
DROP TABLE IF EXISTS candidates;

CREATE TABLE candidates (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  years_experience DECIMAL(4,1) UNSIGNED NOT NULL
);

CREATE TABLE vacancies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  min_years_experience DECIMAL(4,1) UNSIGNED NOT NULL,
  status ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT UNSIGNED NOT NULL,
  vacancy_id INT UNSIGNED NOT NULL,
  cover_letter TEXT NOT NULL,
  source ENUM('REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER') NOT NULL,
  score INT UNSIGNED NOT NULL,
  priority ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
  status ENUM('RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'RECEIVED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_application_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  CONSTRAINT fk_application_vacancy
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id),
  INDEX idx_application_status (status),
  INDEX idx_application_vacancy (vacancy_id),
  INDEX idx_application_candidate_vacancy (candidate_id, vacancy_id)
);

INSERT INTO candidates (name, email, years_experience) VALUES
('Ana López', 'ana@example.com', 5),
('Carlos Pérez', 'carlos@example.com', 2),
('María García', 'maria@example.com', 8);

INSERT INTO vacancies (title, min_years_experience, status) VALUES
('Backend Node.js Developer', 3, 'OPEN'),
('Senior Software Engineer', 6, 'CLOSED');
