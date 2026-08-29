# RateHub - Role-Based Retail Store Rating Platform

RateHub is a full-stack web application designed to collect, aggregate, and present customer ratings for local retail stores. Access is managed through a secure role-based system matching Administrators, Normal Users, and Store Owners.

---

## 1. Key Features
- **Centralized Authentication**: One SSO login page that routes the user to their appropriate role-based dashboard. Uses HTTP-only secure cookie JWT distribution combined with database session tracking.
- **Normal Users**: Browse the store directory, filter/search by store name or address location, rate stores (1–5 stars), and edit ratings in place (upsert).
- **Store Owners**: Dedicated dashboard displaying average store rating, total review count, and a table of customer profiles who reviewed the store.
- **System Administrators**: Platform-wide control dashboard showing total statistics (users, stores, ratings). Manage user profile creation and register retail stores (assigning owners).

---

## 2. Technology Stack

- **Frontend**: React (TypeScript), Tailwind CSS, React Router, Lucide React, Axios.
- **Backend**: NestJS, Prisma ORM, Swagger OpenAPI documentation.
- **Database**: PostgreSQL (UUID keys, indexes, foreign key restricts, check constraints).
- **Security**: Argon2id password hashing, NestJS guards, CORS domains check, Helmet.
- **Testing**: Vitest for unit tests.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI pipelines.

---

## 3. Database Schema

The database uses a fully normalized relational structure:
- **`roles`**: SMALLINT primary key. Holds lookup values `ADMIN`, `USER`, `STORE_OWNER`.
- **`users`**: UUID primary key. Holds name (20–60 characters), email, address, role association, and hashed passwords.
- **`sessions`**: UUID primary key. Holds hashed active JWT session tokens for revocation control.
- **`stores`**: UUID primary key. Holds store details and mapping to an `ownerId` (UNIQUE representing at most 1 store per owner).
- **`ratings`**: UUID primary key. Maps `userId` and `storeId` with a composite unique constraint `UNIQUE(userId, storeId)` to prevent duplicate ratings, and a `CHECK(rating BETWEEN 1 AND 5)`.

---

## 4. Local Installation & Execution

### Prerequisites:
- Node.js (v20+ recommended)
- Docker & Docker Desktop

### Step 1: Environment Variables
Copy `.env.example` in the root and backend folders:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### Step 2: Boot Database Service (Docker)
Start the PostgreSQL container:
```bash
docker compose up -d
```

### Step 3: Run Database Migrations & Seeds
Inside the `backend/` directory, install packages and execute migrations:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
```
*Note: This creates the database schema and seeds default roles and the initial Administrator account.*

### Step 4: Run Application Services

#### A. NestJS Backend:
```bash
cd backend
npm run start:dev
```
- API Endpoint base URL: `http://localhost:3000/api/v1`
- Swagger Interactive Documentation: `http://localhost:3000/api/docs`

#### B. Vite React Frontend:
```bash
cd frontend
npm install
npm run dev
```
- Frontend Web App URL: `http://localhost:5173`

---

## 5. Demo Credentials

The database seeding process registers the following administrative account:
- **Admin Email**: `admin@example.com`
- **Password**: `Admin@123`

---

## 6. Testing

### Run backend unit tests:
```bash
cd backend
npm run test
```
