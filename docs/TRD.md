# Technical Requirements Document (TRD)

## 1. Project Overview
- **Project Name**: RateHub
- **Application Type**: Role-Based Store Rating Web Application
- **Architecture**: Modular Monolith
- **Frontend**: React.js (with TypeScript, React Router, Tailwind CSS, and React Context)
- **Backend**: NestJS (with TypeScript, Prisma ORM, Swagger, and Passport/JWT)
- **Database**: PostgreSQL (relational storage, indexes, and constraints)
- **API Style**: RESTful APIs (following REST conventions, `/api/v1` prefix)
- **Authentication**: JWT-based authentication with HTTP-only Secure Cookies and server-side session tracking.
- **Deployment**: Containerized using Docker + Docker Compose, and prepared for cloud deployment (e.g. AWS or Render/Railway/Vercel).

The system provides a centralized platform where:
1. **Normal users** can search and rate stores.
2. **Store owners** can monitor reviews/ratings for their own stores.
3. **Administrators** can manage users, stores, and view platform statistics.

---

## 2. Technical Goals
The technical implementation must:
- Provide secure authentication and authorization with role-based access control (RBAC).
- Support three distinct user roles (`ADMIN`, `USER`, `STORE_OWNER`).
- Provide standard RESTful API endpoints.
- Maintain strong relational database integrity (foreign keys, cascading rules, unique constraints).
- Prevent duplicate ratings (each user can submit exactly one rating per store, which updates on subsequent attempts).
- Support backend-level pagination, filtering, and sorting.
- Validate inputs on both frontend and backend (DTO validations).
- Keep frontend and backend decoupled and independently deployable.
- Support containerization using Docker for seamless local setup.

---

## 3. Technology Stack

| Layer | Technology | Rationale / Notes |
| :--- | :--- | :--- |
| **Frontend** | React.js | Fast component-based rendering |
| **Frontend Language** | TypeScript | Type safety and autocompletion |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Frontend Routing** | React Router | Declarative routing and protection |
| **State Management** | React Context + Hooks | Avoids heavy Redux setup |
| **Backend** | NestJS | Robust, modular backend framework |
| **Backend Language** | TypeScript | Consistent typing across stack |
| **ORM** | Prisma | Type-safe queries, migration support |
| **Database** | PostgreSQL | Relational integrity and transaction support |
| **Authentication** | JWT | Stateless authentication mechanism |
| **Password Hashing** | Argon2id | Secure, modern password hashing algorithm |
| **Validation** | class-validator / class-transformer | Automated DTO validations on the backend |
| **API Documentation**| Swagger / OpenAPI | Integrated documentation available at `/api/docs` |
| **Testing** | Jest | Unit tests for NestJS |
| **API Testing** | Postman | End-to-end endpoint verification |
| **Containerization** | Docker + Docker Compose | Simplified deployment and environment replication |
| **Version Control** | Git + GitHub | Code management |
| **CI/CD** | GitHub Actions | Automated build, lint, and tests |
| **Deployment** | Render / Railway / Vercel | Cost-effective and fast hosting |

---

## 4. Frontend Technical Requirements

### 4.1 Directory Structure
The React project will reside under `frontend/` and follow this structure:
```
frontend/
├── src/
│   ├── components/  # Reusable UI components (Button, Modal, etc.)
│   ├── pages/       # Page components mapped to routes
│   ├── layouts/     # Shared layouts (Admin, User, Owner layouts)
│   ├── hooks/       # Custom hooks (useAuth, useFetch, etc.)
│   ├── services/    # API calls using Axios (Axios interceptors)
│   ├── context/     # React Context for global state (AuthContext)
│   ├── types/       # Global TypeScript declarations
│   ├── utils/       # Helper functions
│   ├── routes/      # Routing definitions (ProtectedRoute, RoleRoute)
│   └── App.tsx      # Main application entry point
├── public/
└── package.json
```

### 4.2 State Management & Routing
- **AuthContext**: Holds user info, role, token, and exposes `login()` / `logout()` methods.
- **React Router**: Protects paths using components like `<ProtectedRoute>` (checks if user is authenticated) and `<RoleRoute>` (checks if role matches requirements).
- **Route Inventory**:
  - Public: `/login`, `/signup`
  - Admin: `/admin/dashboard`, `/admin/users`, `/admin/users/:id`, `/admin/stores`
  - Normal User: `/stores`
  - Store Owner: `/owner/dashboard`, `/owner/ratings`
  - Shared: `/change-password`

---

## 5. Backend Technical Requirements

### 5.1 Directory Structure
The NestJS project will reside under `backend/` and follow a modular structure:
```
backend/
├── src/
│   ├── auth/       # Authentication endpoints, Guards, and Passport strategies
│   ├── users/      # User CRUD and admin management logic
│   ├── stores/     # Store CRUD and owner association logic
│   ├── ratings/    # Ratings logic, average calculations, and unique constraints
│   ├── admin/      # Admin dashboard and platform stats
│   ├── owner/      # Owner dashboard and owner-specific ratings listing
│   ├── common/     # Shared decorators, exceptions, interceptors, filters
│   ├── config/     # Environment variable configuration loading
│   ├── database/   # Prisma service and connection
│   └── main.ts     # Main API bootstrapping
```

### 5.2 Architecture Design Pattern
- **Modular Monolith**: Auth Module, User Module, Store Module, and Rating Module interact directly through service injection, maintaining strict decoupling boundaries.
- **Controller-Service-Repository**:
  1. **Controller**: Handles HTTP requests, maps routes, and applies DTO validations.
  2. **Service**: Coordinates business logic and orchestrates transactions.
  3. **Repository (Prisma Service)**: Manages direct data operations with PostgreSQL.

---

## 6. Authentication & Session Security
- **JWT Generation**: Generated upon successful login containing user ID and role in the payload:
  ```json
  {
    "sub": "user-uuid-string",
    "role": "USER"
  }
  ```
- **Token Storage**: Distributed via HTTP-only Secure Cookies containing options:
  - `HttpOnly`: Prevents client-side scripts from reading the token (mitigates XSS).
  - `Secure`: Ensures cookies are only sent over HTTPS connections.
  - `SameSite`: Set to `Lax` or `Strict` to protect against CSRF attacks.
- **Session Tracking**: Sessions are tracked server-side in a `sessions` table:
  - Stores a hash of the token (`token_hash`) instead of the raw token.
  - Tracks expiration, revocation state, and IP / User Agent metadata if needed.
  - Allows admins/users to revoke sessions, logging out active sessions.
- **Password Security**: Managed using Argon2id password hashing.

---

## 7. Database Security & Relational Integrity
- **Relational Constraints**:
  - `UNIQUE(user_id, store_id)` on ratings.
  - `CHECK(rating BETWEEN 1 AND 5)` on ratings.
  - `UNIQUE(owner_id)` on stores (representing 1:0..1 mapping).
- **Foreign Key Delete Rules**:
  - `Role` → `User`: `ON DELETE RESTRICT` (roles cannot be deleted if assigned).
  - `User` → `Session`: `ON DELETE CASCADE` (deleting user wipes sessions).
  - `User` → `Rating`: `ON DELETE CASCADE` (deleting user removes ratings).
  - `Store` → `Rating`: `ON DELETE CASCADE` (deleting store removes ratings).
  - `User` → `Store Owner`: `ON DELETE RESTRICT` (owners cannot be deleted while owning a store).

---

## 8. Performance & Optimization
- **Backend Pagination**: Mandatory for listings like users and stores. Uses database `LIMIT` and `OFFSET` queries.
- **Indexing**:
  - `users.email` (Unique Index)
  - `users.name` (Non-unique Index)
  - `users.role_id` (Non-unique Index)
  - `stores.name`, `stores.address`, `stores.owner_id` (Non-unique Indexes)
  - `ratings.user_id`, `ratings.store_id`, `(user_id, store_id)` (Unique Composite Index)
  - `sessions.token_hash` (Unique), `sessions.user_id`, `sessions.expires_at`
- **Caching / CDNs**: Serve static assets via CDN. API response times should be targeted below 500ms for standard operations.

---

## 9. Input Validation & Error Handling
- **NestJS Validation Pipe**: Globally enabled using `ValidationPipe({ transform: true, whitelist: true })`.
- **Centralized Exceptions**: Global filters to catch exceptions and shape standard errors:
  ```json
  {
    "success": false,
    "message": "Error details",
    "errorCode": "ERROR_CODE"
  }
  ```
- Do not expose raw database errors or stack traces in production.
