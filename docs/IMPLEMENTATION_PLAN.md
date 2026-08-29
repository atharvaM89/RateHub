# Implementation Plan & Build Sequence

## 1. Project Directory Structure
```
ratehub/
├── docs/                # Project documentation (PRD, TRD, Schema, App Flow)
├── frontend/            # React + TypeScript client-side project
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/             # NestJS + TypeScript server-side project
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── stores/
│   │   ├── ratings/
│   │   ├── admin/
│   │   ├── owner/
│   │   ├── common/
│   │   ├── config/
│   │   ├── database/
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── docker-compose.yml   # Multi-container local execution setup
├── .gitignore
├── .env.example
└── README.md
```

---

## 2. Phase-by-Phase Build Plan

The build order progresses from infrastructure foundation up to API development, UI construction, validation, and production integration.

```
01. Repository Setup 
   ↓
02. React Frontend Setup
   ↓
03. NestJS Backend Setup
   ↓
04. PostgreSQL + Prisma Config
   ↓
05. Database Schema & Seed Migration
   ↓
06. Global NestJS Configuration & Architecture
   ↓
07. Session Authentication & JWT Implementation
   ↓
08. RBAC Guards & Ownership Authorization
   ↓
09. Admin User Management APIs
   ↓
10. Store Management APIs
   ↓
11. Rating Logic & Aggregation APIs
   ↓
12. Admin Dashboard Aggregation APIs
   ↓
13. Store Owner Dashboard & Ratings APIs
   ↓
14. Shared Reusable React Components
   ↓
15. Frontend Auth Integration (AuthContext)
   ↓
16. Admin UI Construction (User/Store Tables)
   ↓
17. Normal User UI Construction (Store Listing & Search)
   ↓
18. Store Owner UI Construction (Dashboard & Ratings Table)
   ↓
19. Full API Integration (Axios client config)
   ↓
20. Loading Skeletons & Error/Empty States
   ↓
21. Security Verification Testing
   ↓
22. Unit Testing Implementation (Jest)
   ↓
23. API End-to-End Testing (Postman)
   ↓
24. E2E User Journey Walkthrough Tests
   ↓
25. Docker Containerization
   ↓
26. GitHub Actions CI Configuration
   ↓
27. Production Deploy Config
   ↓
28. Final UI/UX Polish
   ↓
29. Documentation (README.md)
   ↓
30. Submission
```

---

## 3. Detail Specifications by Build Phase

### Phase 1: Environment & Framework Initialization (Steps 1–3)
- Set up directories. Add parent `.gitignore`, `.env.example`.
- Initialize Vite React + TypeScript inside `frontend/`. Install Tailwind CSS, React Router, Axios, Lucide React.
- Initialize NestJS CLI project inside `backend/`. Install Prisma, `@prisma/client`, Argon2, class-validator, class-transformer, Helmet, Swagger, CORS, NestJS Throttle (rate-limiting).

### Phase 2: Database Layer (Steps 4–5)
- Set up local PostgreSQL via Docker Compose (`docker-compose.yml` defining database service).
- Configure Prisma (`schema.prisma` mapping out tables/indexes/FK deletes).
- Create first migration using Prisma CLI.
- Construct `prisma/seed.ts` seeding default roles (`ADMIN`, `USER`, `STORE_OWNER`) and an initial system administrator profile.

### Phase 3: NestJS Backend Foundation (Step 6)
- Setup database module (`PrismaService` wrapper).
- Configure Global Validation Pipe (`ValidationPipe`), Global Exception Filter (intercepting errors to standard formatting).
- Enable CORS mapping to development frontend (`http://localhost:5173`). Setup Helmet security headers. Enable prefix `/api/v1` and Swagger documentation at `/api/docs`.

### Phase 4: Authentication & Authorization (Steps 7–8)
- Build Passport JWT strategies. Configure session database tracking in `sessions` table.
- Create `/auth/register` (Normal user sign-up) and `/auth/login` (generates session, sets HTTP-only secure cookie).
- Create `JwtAuthGuard` and `RolesGuard`. Implement `@Roles('ADMIN')` decorator checks.
- Implement ownership verification middleware/helper (e.g. check if current user matches requested user ID or if current user owns the store related to requested resource).

### Phase 5: Domain API Implementation (Steps 9–13)
- **User Module**: Admin User APIs (`POST /api/v1/users`, `GET /api/v1/users` supporting filter, sort, pagination, `GET /api/v1/users/:id`).
- **Store Module**: Admin Store APIs (`POST /api/v1/stores` validating owner, `GET /api/v1/stores` with search, sort, pagination).
- **Ratings Module**: Submit rating (`POST /api/v1/stores/:storeId/ratings`), modify rating (`PATCH /api/v1/stores/:storeId/ratings`), read rating (`GET /api/v1/stores/:storeId/ratings/me`). Write database aggregation queries compute averages.
- **Admin Dashboard Module**: `GET /api/v1/admin/dashboard` returning database counts for users, stores, and ratings.
- **Store Owner Module**: `GET /api/v1/owner/dashboard` and `GET /api/v1/owner/ratings` returning statistics and customer reviews for owned stores.

### Phase 6: Frontend Development & State Management (Steps 14–15)
- Code generic components: Button, Input, Card, Table, StarRating, Modal, Pagination, Skeletons.
- Construct `AuthContext` managing login state, HTTP cookie credentials, role redirection.
- Secure routing using router guards (`ProtectedRoute` / `RoleRoute`).

### Phase 7: React UI Implementation (Steps 16–18)
- **Admin Section**: Main layout with sidebar. Dashboard statistics cards. User Table and Store Table with filtering, pagination, sorting. Add User form and Add Store form.
- **User Section**: Store list grid. Store cards showing global/personal star averages. Submit rating rating modal. Search text-fields.
- **Store Owner Section**: Dashboard displaying ratings average. Table of customers who reviewed store.

### Phase 8: Integration & UI Polish (Steps 19–20)
- Connect all React forms and components to API calls via Axios service wrappers. Remove mock data.
- Integrate skeleton placeholders during loading cycles.
- Integrate error display overlays with custom retry actions.

### Phase 9: Hardening & Testing (Steps 21–24)
- **Security Check**: Attempt accessing Admin/Owner endpoints using a Normal User token and ensure `403 Forbidden` responses.
- Write unit tests for Services (`AuthService`, `UserService`, `RatingService`).
- Construct complete Postman collections covering normal path flows and error conditions (such as invalid inputs, duplicate emails, unauthorized permissions).

### Phase 10: Dockerization, CI/CD & Documentation (Steps 25–30)
- Package NestJS and PostgreSQL in `docker-compose.yml`.
- Build GitHub Actions workflow file `.github/workflows/ci.yml` running lint checks, unit tests, and production build checks.
- Create production config (.env configurations, HTTPS redirection).
- Finalize documentation containing installation instructions, configuration parameters, and run commands.
