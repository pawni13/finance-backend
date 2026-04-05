# Finance Dashboard API

A RESTful backend for a finance dashboard system supporting authentication, role-based access control, financial record management, and summary analytics.

## Live URL : 
https://finance-backend-6fug.onrender.com
## Tech Stack

| Layer         | Choice             | Reason                                    |
| ------------- | ------------------ | ----------------------------------------- |
| Runtime       | Node.js v20        | Async-first, good for I/O-heavy APIs      |
| Framework     | Express.js         | Minimal and flexible                      |
| Database      | PostgreSQL         | Strong relational database                |
| ORM           | Prisma v5          | Type-safe queries and clean schema        |
| Auth          | JWT                | Stateless authentication                  |
| Validation    | Zod v3             | Schema-based validation with clear errors |
| Hashing       | bcryptjs           | Password hashing                          |
| Rate Limiting | express-rate-limit | Basic abuse protection                    |

## Setup

### Prerequisites

* Node.js v18+
* PostgreSQL running locally

### Steps

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

### Environment variables

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/finance_db"
JWT_SECRET="your_secret_key"
PORT=3000
```

Server runs at:

```
http://localhost:3000
```

## Project Structure

```
src/
├── controllers/    # Handles request/response
├── services/       # Business logic and DB queries
├── routes/         # Express routes
├── middleware/     # Auth, role guard, error handling
├── utils/
│   ├── prisma.js
│   └── validate.js
└── index.js
```

Design approach: controllers stay thin, services handle logic. This keeps things easier to test and maintain.

## Data Model

```prisma
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(VIEWER)
  status    Status    @default(ACTIVE)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model FinancialRecord {
  id          String     @id @default(uuid())
  amount      Decimal    @db.Decimal(12, 2)
  type        RecordType
  category    String
  date        DateTime
  description String?
  deletedAt   DateTime?
  userId      String

  @@index([userId])
  @@index([type])
  @@index([date])
  @@index([category])
  @@index([deletedAt])
}
```

## Roles & Permissions

| Action         | VIEWER | ANALYST | ADMIN |
| -------------- | ------ | ------- | ----- |
| View records   | Yes    | Yes     | Yes   |
| View dashboard | Yes    | Yes     | Yes   |
| Create records | No     | Yes     | Yes   |
| Update records | No     | Yes     | Yes   |
| Delete records | No     | No      | Yes   |
| Manage users   | No     | No      | Yes   |

Example middleware usage:

```js
router.post('/', roleGuard('ADMIN', 'ANALYST'), validate(recordSchema), createRecord)
router.delete('/:id', roleGuard('ADMIN'), deleteRecord)
```

## API

### Auth

#### POST /api/auth/register

```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

#### POST /api/auth/login

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": { "id": "...", "name": "Admin User", "role": "ADMIN" }
  }
}
```

Use token:

```
Authorization: Bearer <token>
```

## Financial Records

### POST /api/records

```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-04-01",
  "description": "Monthly salary"
}
```

### GET /api/records

Supports filtering, search, and pagination:

| Param    | Example    | Description        |
| -------- | ---------- | ------------------ |
| type     | INCOME     | Filter by type     |
| category | Salary     | Filter by category |
| from     | 2024-01-01 | Start date         |
| to       | 2024-12-31 | End date           |
| search   | salary     | Search text        |
| page     | 1          | Page number        |
| limit    | 10         | Page size          |

Response:

```json
{
  "success": true,
  "data": {
    "records": [...],
    "total": 42,
    "page": 1,
    "totalPages": 5
  }
}
```

### PATCH /api/records/:id

Partial update.

### DELETE /api/records/:id

Soft delete using `deletedAt`.

## Dashboard

### GET /api/dashboard/summary

```json
{
  "success": true,
  "data": {
    "totalIncome": 5000,
    "totalExpenses": 0,
    "netBalance": 5000
  }
}
```

### Other endpoints

* `/api/dashboard/by-category`
* `/api/dashboard/trends`
* `/api/dashboard/recent`

## User Management (Admin)

| Method | Endpoint       | Description |
| ------ | -------------- | ----------- |
| GET    | /api/users     | List users  |
| GET    | /api/users/:id | Get user    |
| PATCH  | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## Validation & Errors

Validation is handled before business logic.

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Number must be greater than 0" }
  ]
}
```

Unauthorized:

```json
{ "success": false, "message": "Access denied" }
```
## Screenshots

Postman test cases covering authentication, validation, role-based access, and dashboard endpoints.
<p align="center">
  <img src="https://github.com/user-attachments/assets/ab1e3e2f-2e80-4172-aa11-8464622310d7" width="30%" />
  <img src="https://github.com/user-attachments/assets/e10f2a63-c27b-47bd-bec1-d1d70e413223" width="30%" />
  <img src="https://github.com/user-attachments/assets/0604692c-9b5c-4ac6-a90c-593a3dc7b279" width="30%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/9edb2d0e-cb6b-4193-a8e7-d9790423b221" width="30%" />
  <img src="https://github.com/user-attachments/assets/0942919f-3177-4979-aef3-ed27312dba59" width="30%" />
  <img src="https://github.com/user-attachments/assets/4ad6dcfe-b8c8-478a-9595-cc0b2f13211f" width="30%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/0bc3f499-be1d-4938-9557-b08dafc0808f" width="30%" />
  <img src="https://github.com/user-attachments/assets/e6a354bc-29b0-41a6-97b7-961552f92a39" width="30%" />
  <img src="https://github.com/user-attachments/assets/c3dd8768-8a21-497c-ae18-e8f28a736e90" width="30%" />
</p>
<p align="center">
<img width="30%" src="https://github.com/user-attachments/assets/c4fbf1a4-0c0b-4cc7-a9e5-9a85ad802ae3" />
<img width="30%" src="https://github.com/user-attachments/assets/a0f47a2f-a5ef-415a-8384-e6469ac959df" />
<img width="30%" src="https://github.com/user-attachments/assets/fe46aa08-9c47-4340-9377-9f594098de89" />
  </p>
  <p align="center">
<img width="30%" src="https://github.com/user-attachments/assets/5faff8f9-a564-4eda-b38a-04b107d7c236" />
<img width="30%" src="https://github.com/user-attachments/assets/0db7e118-53cd-4b1f-a725-dc7a4eb7469c" />
</p>

## Notes

* Uses decimal for money to avoid floating-point errors
* Uses soft delete instead of hard delete
* Indexed fields used for filtering to improve performance
* Role stored in JWT to avoid DB lookups per request
* Services handle logic, controllers handle HTTP
