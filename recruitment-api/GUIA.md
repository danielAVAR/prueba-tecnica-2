# Recruitment API — Guía paso a paso

## 0. Qué estamos construyendo

Una API REST en Node.js conectada a MySQL para gestionar postulaciones.

El flujo principal es:

```text
HTTP Request
    ↓
Route
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL
```

El cliente NO habla directamente con MySQL.

La API REST es la puerta de entrada al backend.

---

# 1. Qué pide el proyecto

Debemos almacenar:

### Candidate

- id
- name
- email
- years_experience

### Vacancy

- id
- title
- min_years_experience
- status

### Application

- id
- candidate_id
- vacancy_id
- cover_letter
- source
- score
- priority
- status
- created_at
- status_updated_at

Fuentes permitidas:

```text
REFERRAL
INTERNAL
JOB_BOARD
OTHER
```

Estados de application:

```text
RECEIVED
IN_REVIEW
REJECTED
HIRED
```

Estados de vacancy:

```text
OPEN
CLOSED
```

---

# 2. Por qué NO usamos Enquirer

El proyecto original de pensamiento proponía:

```text
app.js → menus → Enquirer → service
```

Eso sería apropiado para una aplicación CLI.

Pero el enunciado pide una API REST.

Por eso ahora tenemos:

```text
Postman / frontend / otro cliente
             ↓
        HTTP request
             ↓
           API
```

Enquirer no es necesario.

---

# 3. Preparar el proyecto

Crear carpeta:

```bash
mkdir recruitment-api
cd recruitment-api
```

Inicializar Node:

```bash
npm init -y
```

Instalar dependencias:

```bash
npm install express mysql2 dotenv
```

Crear carpetas:

```bash
mkdir -p src/config src/controllers src/models src/repositories src/routes src/services src/utils tests
```

---

# 4. Configuración de MySQL

Copiar:

```text
.env.example
```

como:

```text
.env
```

Editar:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=recruitment_api
```

IMPORTANTE:

`.env` contiene secretos y no debe subirse a GitHub.

---

# 5. Crear la base de datos

Ejecutar:

```bash
mysql -u root -p < database.sql
```

El script crea:

```text
recruitment_api
```

y las tablas:

```text
candidates
vacancies
applications
```

También inserta 3 candidatos y 2 vacantes, una CLOSED.

---

# 6. Entender la relación de las tablas

Una persona puede realizar varias postulaciones:

```text
Candidate 1
    │
    ├── Application 1
    ├── Application 2
    └── Application 3
```

Una vacante también puede recibir varias postulaciones:

```text
Vacancy 1
    │
    ├── Application 1
    ├── Application 2
    └── Application 3
```

Por eso:

```text
candidates 1 ─── N applications N ─── 1 vacancies
```

`applications.candidate_id` es FK hacia `candidates.id`.

`applications.vacancy_id` es FK hacia `vacancies.id`.

---

# 7. Conexión Node → MySQL

Archivo:

```text
src/config/database.js
```

Usamos:

```js
mysql.createPool(...)
```

Un pool mantiene varias conexiones disponibles.

Los repositories importan este pool y ejecutan SQL mediante:

```js
pool.execute(sql, params)
```

Ejemplo:

```js
await pool.execute(
  'SELECT * FROM candidates WHERE id = ?',
  [id]
);
```

El `?` es un placeholder.

No debemos construir SQL concatenando datos del usuario.

---

# 8. Repository

Un Repository tiene una responsabilidad:

> saber cómo obtener o modificar datos.

Ejemplo:

```js
candidateRepository.findById(3)
```

Internamente:

```sql
SELECT ...
FROM candidates
WHERE id = ?
```

El Service no necesita conocer ese SQL.

Eso separa:

```text
Business Logic
      ≠
Database Access
```

---

# 9. Service

El Service contiene las reglas del negocio.

Para crear una postulación:

```text
1. validar datos
2. validar source
3. buscar candidate
4. buscar vacancy
5. verificar OPEN
6. verificar duplicidad
7. calcular score
8. calcular priority
9. guardar
10. devolver resultado
```

Esta es la parte más importante de la aplicación.

---

# 10. Controller

El Controller traduce HTTP a llamadas del Service.

POST:

```http
POST /applications
```

Body:

```json
{
  "candidateId": 3,
  "vacancyId": 1,
  "source": "REFERRAL",
  "coverLetter": "I have four years of experience building REST APIs"
}
```

El Controller hace:

```js
service.create(req.body)
```

y devuelve:

```http
201 Created
```

---

# 11. Routes

Las routes conectan una URL con un Controller.

Tenemos:

```text
POST /applications
GET /applications
PUT /applications/:id/status
```

Piensa:

```text
URL + HTTP method
          ↓
       Controller
```

---

# 12. POST /applications

Ejemplo:

```bash
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": 1,
    "vacancyId": 1,
    "source": "REFERRAL",
    "coverLetter": "I have experience building REST APIs"
  }'
```

El backend:

```text
request
  ↓
controller
  ↓
service
  ↓
candidate repository
  ↓
vacancy repository
  ↓
duplicate check
  ↓
priority calculation
  ↓
application repository
  ↓
MySQL
```

---

# 13. Regla de duplicidad

El candidato NO puede volver a postularse si ya tiene:

```text
RECEIVED
IN_REVIEW
HIRED
```

Si tiene:

```text
REJECTED
```

debe esperar 30 días.

El Service es quien aplica esta regla.

---

# 14. GET /applications

Todos:

```bash
curl http://localhost:3000/applications
```

Por estado:

```bash
curl "http://localhost:3000/applications?status=IN_REVIEW"
```

Por vacante:

```bash
curl "http://localhost:3000/applications?vacancyId=1"
```

Ambos:

```bash
curl "http://localhost:3000/applications?status=RECEIVED&vacancyId=1"
```

El Repository hace el JOIN para devolver:

```text
application
candidate name
candidate email
vacancy title
```

Orden:

```text
score DESC
created_at ASC
```

---

# 15. PUT /applications/:id/status

Ejemplo:

```bash
curl -X PUT http://localhost:3000/applications/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_REVIEW"}'
```

El `:id` es un route parameter.

Por ejemplo:

```text
/applications/15/status
             ↑
             id = 15
```

Una aplicación `REJECTED` o `HIRED` es final y no puede cambiar.

---

# 16. Score y Priority

ATENCIÓN:

El material entregado exige calcular score y priority, pero no proporciona en el texto las reglas numéricas exactas.

Por eso este proyecto usa una regla provisional, claramente aislada en:

```text
src/services/priority.service.js
```

Regla utilizada:

```text
+50 si cumple experiencia mínima

+10 por cada año completo sobre el mínimo
máximo +30

+20 si source = REFERRAL
```

Priority:

```text
80+     HIGH
50-79   MEDIUM
0-49    LOW
```

Si tu profesor tiene una tabla diferente, SOLO cambia `priority.service.js`.

Esto evita contaminar el resto del sistema con la regla de scoring.

---

# 17. Por qué existen Models

Los Models representan entidades:

```text
Candidate
Vacancy
Application
```

Por ejemplo:

```js
new Candidate(row)
```

transforma una fila de MySQL en un objeto de dominio.

No son obligatorios para que Express funcione, pero ayudan a mantener una estructura orientada a objetos.

---

# 18. Error handling

El Service puede lanzar:

```js
throw new HttpError(404, 'Candidate not found');
```

El middleware global de Express convierte eso en:

```json
{
  "error": "Candidate not found"
}
```

con:

```http
404 Not Found
```

La idea es:

```text
Service
  ↓
Error
  ↓
Express error middleware
  ↓
HTTP response
```

---

# 19. Ejecutar

Instalar:

```bash
npm install
```

Iniciar:

```bash
npm start
```

o durante desarrollo:

```bash
npm run dev
```

Deberías ver:

```text
Recruitment API running on http://localhost:3000
```

Probar:

```bash
curl http://localhost:3000/health
```

Respuesta:

```json
{
  "status": "ok"
}
```

---

# 20. Tests

Ejecutar:

```bash
npm test
```

Tenemos tres pruebas relacionadas con score/priority:

1. experiencia exactamente igual al mínimo
2. experiencia superior + REFERRAL
3. experiencia inferior al mínimo

Los tests prueban la lógica aislada sin necesitar HTTP.

---

# 21. Arquitectura final

```text
                  CLIENT
             Postman / Frontend
                     │
                     │ HTTP
                     ▼
              ┌──────────────┐
              │    ROUTES    │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │ CONTROLLER   │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │   SERVICE    │
              │              │
              │ Validations  │
              │ Business     │
              │ Rules        │
              │ Score        │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │ REPOSITORY   │
              │              │
              │ SQL          │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │    MYSQL     │
              └──────────────┘
```

---

# 22. Flujo completo de POST

```text
POST /applications
       │
       ▼
application.routes.js
       │
       ▼
application.controller.js
       │
       ▼
application.service.js
       │
       ├── candidate.repository
       │        ↓
       │      MySQL
       │
       ├── vacancy.repository
       │        ↓
       │      MySQL
       │
       ├── validateDuplicate()
       │
       ├── calculatePriority()
       │
       ▼
application.repository
       │
       ▼
     MySQL
       │
       ▼
   HTTP 201
```

---

# 23. Qué debes recordar

La idea principal no es memorizar archivos.

Memoriza las responsabilidades:

```text
ROUTE
"¿Qué URL y método?"

CONTROLLER
"¿Qué hago con la petición HTTP?"

SERVICE
"¿Qué reglas debe cumplir?"

REPOSITORY
"¿Cómo consulto/modifico MySQL?"

MODEL
"¿Qué representa este dato?"

DATABASE
"¿Dónde se almacenan los datos?"
```

Y la regla más importante:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

No:

```text
Controller → MySQL
```

ni:

```text
Service → SQL directo
```

---

# 24. Checklist de entrega

- [x] Node.js
- [x] MySQL
- [x] API REST
- [x] POST `/applications`
- [x] GET `/applications`
- [x] filtros
- [x] PUT `/applications/:id/status`
- [x] validación de source
- [x] validación de candidato
- [x] validación de vacancy
- [x] vacancy OPEN
- [x] duplicidad
- [x] 30 días después de REJECTED
- [x] score
- [x] priority
- [x] estado RECEIVED inicial
- [x] fecha de actualización
- [x] 3 candidatos
- [x] 2 vacantes
- [x] una vacante CLOSED
- [x] 3 tests
- [x] `.env`
- [x] Repository Pattern
- [x] separación Controller / Service / Repository

## Comando final

```bash
npm install
```

Configura `.env`, ejecuta `database.sql` y después:

```bash
npm start
```

Para desarrollo:

```bash
npm run dev
```
