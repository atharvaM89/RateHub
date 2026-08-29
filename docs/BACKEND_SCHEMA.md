# Backend Database Schema Document

## 1. Database Overview
- **Database Engine**: PostgreSQL
- **ORM Mapping**: Prisma
- **Primary Key Format**: UUIDv4 (auto-generated)
- **Timezone Storage**: UTC (uses `TIMESTAMPTZ` data types)
- **State Deletions**: Hard delete for ratings/sessions, deactivation (`is_active: false`) for user accounts. No soft deletion database tables are created.

---

## 2. Table Schemas & Columns

### 2.1 roles Table
Defines available system authorization permissions.
```
 roles
 ├── id: SMALLINT (PK, Auto-increment)
 ├── name: VARCHAR(30) (UNIQUE, NOT NULL)
 ├── created_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
 └── updated_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
```
*Seed Data*:
- `1` → `ADMIN`
- `2` → `USER`
- `3` → `STORE_OWNER`

### 2.2 users Table
Stores authenticated profiles. Used uniformly by Administrators, Normal Users, and Store Owners.
```
 users
 ├── id: UUID (PK, DEFAULT gen_random_uuid())
 ├── name: VARCHAR(60) (NOT NULL)
 ├── email: VARCHAR(255) (UNIQUE, NOT NULL)
 ├── password_hash: VARCHAR(255) (NOT NULL)
 ├── address: VARCHAR(400) (NOT NULL)
 ├── role_id: SMALLINT (FK -> roles.id, ON DELETE RESTRICT)
 ├── is_active: BOOLEAN (NOT NULL, DEFAULT TRUE)
 ├── created_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
 └── updated_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
```
*Constraints*:
- `CHECK (char_length(name) BETWEEN 20 AND 60)`

### 2.3 sessions Table
Tracks active authenticated sessions for revocation capability and JWT rotation.
```
 sessions
 ├── id: UUID (PK, DEFAULT gen_random_uuid())
 ├── user_id: UUID (FK -> users.id, ON DELETE CASCADE)
 ├── token_hash: VARCHAR(255) (UNIQUE, NOT NULL)
 ├── expires_at: TIMESTAMPTZ (NOT NULL)
 ├── revoked_at: TIMESTAMPTZ (NULL)
 ├── created_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
 └── last_used_at: TIMESTAMPTZ (NULL)
```

### 2.4 stores Table
Stores registered retail entries.
```
 stores
 ├── id: UUID (PK, DEFAULT gen_random_uuid())
 ├── name: VARCHAR(255) (NOT NULL)
 ├── email: VARCHAR(255) (NOT NULL)
 ├── address: VARCHAR(400) (NOT NULL)
 ├── owner_id: UUID (FK -> users.id, UNIQUE, ON DELETE RESTRICT)
 ├── created_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
 └── updated_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
```
*Relationships*:
- `owner_id` is marked `UNIQUE` to satisfy the V1 business constraint of a 1:0..1 mapping (one user owns at most one store).

### 2.5 ratings Table
Captures rating records submitted by customers.
```
 ratings
 ├── id: UUID (PK, DEFAULT gen_random_uuid())
 ├── user_id: UUID (FK -> users.id, ON DELETE CASCADE)
 ├── store_id: UUID (FK -> stores.id, ON DELETE CASCADE)
 ├── rating: SMALLINT (NOT NULL)
 ├── created_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
 └── updated_at: TIMESTAMPTZ (NOT NULL, DEFAULT NOW())
```
*Constraints*:
- `UNIQUE(user_id, store_id)` (Ensures single rating per store, per user).
- `CHECK(rating BETWEEN 1 AND 5)`

---

## 3. Recommended PostgreSQL DDL
```sql
-- Create roles table
CREATE TABLE roles (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role_id SMALLINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    CONSTRAINT chk_user_name_length CHECK (char_length(name) BETWEEN 20 AND 60)
);

-- Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_stores_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    store_id UUID NOT NULL,
    rating SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_user_store_rating UNIQUE (user_id, store_id)
);

-- Indexes Strategy
CREATE INDEX users_name_idx ON users(name);
CREATE INDEX users_role_id_idx ON users(role_id);
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_expires_at_idx ON sessions(expires_at);
CREATE INDEX stores_name_idx ON stores(name);
CREATE INDEX stores_address_idx ON stores(address);
CREATE INDEX stores_owner_id_idx ON stores(owner_id);
CREATE INDEX ratings_user_id_idx ON ratings(user_id);
CREATE INDEX ratings_store_id_idx ON ratings(store_id);
```

---

## 4. Prisma Schema Design
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Role {
  id        Int      @id @default(autoincrement()) @db.SmallInt
  name      String   @unique @db.VarChar(30)
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  users     User[]

  @@map("roles")
}

model User {
  id           String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name         String    @db.VarChar(60)
  email        String    @unique @db.VarChar(255)
  passwordHash String    @map("password_hash") @db.VarChar(255)
  address      String    @db.VarChar(400)
  roleId       Int       @map("role_id") @db.SmallInt
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @db.Timestamptz
  updatedAt    DateTime  @updatedAt @db.Timestamptz
  role         Role      @relation(fields: [roleId], references: [id], onDelete: Restrict)
  sessions     Session[]
  ownedStore   Store?
  ratings      Rating[]

  @@index([name])
  @@index([roleId])
  @@map("users")
}

model Session {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId     String    @map("user_id") @db.Uuid
  tokenHash  String    @unique @map("token_hash") @db.VarChar(255)
  expiresAt  DateTime  @map("expires_at") @db.Timestamptz
  revokedAt  DateTime? @map("revoked_at") @db.Timestamptz
  createdAt  DateTime  @default(now()) @db.Timestamptz
  lastUsedAt DateTime? @map("last_used_at") @db.Timestamptz
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("sessions")
}

model Store {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String   @db.VarChar(255)
  email     String   @db.VarChar(255)
  address   String   @db.VarChar(400)
  ownerId   String   @unique @map("owner_id") @db.Uuid
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  owner     User     @relation(fields: [ownerId], references: [id], onDelete: Restrict)
  ratings   Rating[]

  @@index([name])
  @@index([address])
  @@index([ownerId])
  @@map("stores")
}

model Rating {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  storeId   String   @map("store_id") @db.Uuid
  rating    Int      @db.SmallInt
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@unique([userId, storeId])
  @@index([userId])
  @@index([storeId])
  @@map("ratings")
}
```
