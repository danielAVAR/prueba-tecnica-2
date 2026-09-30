# Recruitment API

REST API para gestionar postulaciones laborales.

## Stack

- Node.js
- Express
- MySQL
- mysql2
- dotenv

## Endpoints

- `POST /applications`
- `GET /applications`
- `PUT /applications/:id/status`
- `GET /health`

## Arquitectura

Routes → Controllers → Services → Repositories → MySQL

Consulta `GUIA.md` para la explicación completa paso a paso.
