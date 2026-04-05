# Finance Dashboard API

A RESTful backend for a finance dashboard system supporting authentication, role-based access control, financial record management, and summary analytics.

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

## Notes

* Uses decimal for money to avoid floating-point errors
* Uses soft delete instead of hard delete
* Indexed fields used for filtering to improve performance
* Role stored in JWT to avoid DB lookups per request
* Services handle logic, controllers handle HTTP
