# Product Requirements Document (PRD)

## 1. App Name
RateHub

## 2. One-Line App Idea
RateHub is a role-based store rating platform where users can discover stores, submit 1–5 star ratings, and store owners can monitor their store’s customer feedback.

## 3. App Overview
RateHub is a full-stack web application built around a centralized store-rating system.
The platform supports three types of users:
1. **System Administrator**
2. **Normal User**
3. **Store Owner**

All users access the application through a **single authentication system**. After login, the application identifies the user's role and provides access to the appropriate dashboard and functionality.

- **Normal users** can browse stores, search for stores, view ratings, and submit or modify their own ratings.
- **Store owners** can monitor ratings submitted for their store and view their store's average rating.
- **System administrators** have complete platform-management capabilities, including managing users and stores and viewing platform-level statistics.

The application demonstrates:
- Clean REST API design
- Role-based access control (RBAC)
- Relational database design
- Authentication and authorization
- Input validation
- Search and filtering
- Sorting
- Pagination where appropriate
- Responsive React UI
- Secure password handling
- Proper frontend/backend separation

---

## 4. Problem Statement
Users often need to evaluate stores before deciding whether to visit or purchase from them, while store owners need a simple way to understand how customers perceive their business.

Without a centralized rating platform:
- Users have difficulty comparing stores.
- Store ratings may not be consistently presented.
- Store owners have limited visibility into customer feedback.
- Administrators lack centralized control over stores, users, and ratings.

RateHub solves this by providing a single platform where:
- **Users** → Discover and rate stores
- **Store Owners** → Monitor ratings
- **Administrators** → Manage the entire platform

---

## 5. Product Goals
The primary goals of Version 1 are:
1. Build a secure role-based authentication system.
2. Allow normal users to discover registered stores.
3. Allow users to submit ratings from 1–5.
4. Allow users to modify their existing rating.
5. Allow store owners to monitor ratings and average scores.
6. Allow administrators to manage users and stores.
7. Provide administrators with platform-level statistics.
8. Provide search, filtering, and sorting functionality.
9. Maintain a clean and normalized relational database.
10. Deliver a responsive and easy-to-use React interface.

---

## 6. Target Users

### 6.1 System Administrators
Platform administrators responsible for managing the application. They need to:
- Create users
- Create administrators
- Create stores
- View platform statistics
- View users
- View stores
- Filter and sort records
- View detailed user information

### 6.2 Normal Users
Customers who want to discover and rate stores. They need to:
- Register
- Log in
- Find stores
- Search stores
- View ratings
- Submit ratings
- Modify their ratings
- Manage their password

### 6.3 Store Owners
Business owners who want to monitor customer feedback. They need to:
- Log in
- View their store's average rating
- View users who rated their store
- Manage their password

---

## 7. User Roles & Permissions

| Feature | Admin | Normal User | Store Owner |
| :--- | :--- | :--- | :--- |
| **Login** | Yes | Yes | Yes |
| **Signup** | No | Yes | No |
| **Create users** | Yes | No | No |
| **Create admins** | Yes | No | No |
| **Create stores** | Yes | No | No |
| **View all stores** | Yes | Yes | Own store |
| **Search stores** | Yes | Yes | No |
| **Submit rating** | No | Yes | No |
| **Modify rating** | No | Yes | No |
| **View submitted ratings** | Yes | Own ratings | Ratings for own store |
| **View average rating** | Yes | Yes | Yes |
| **View all users** | Yes | No | No |
| **Filter users** | Yes | No | No |
| **Filter stores** | Yes | Yes/Search | No |
| **Sort listings** | Yes | Yes | Yes |
| **Change password** | Yes | Yes | Yes |
| **Logout** | Yes | Yes | Yes |

---

## 8. Main Features

### 8.1 Authentication & Authorization
A single login system will be used for all three roles.

#### Login Flow:
Users provide:
- Email
- Password

After successful authentication:
1. Backend validates credentials.
2. Backend identifies the user's role.
3. Authentication token/session is generated.
4. User is redirected to the appropriate dashboard:
   - **Admin** → Admin Dashboard
   - **User** → Store Listing
   - **Owner** → Owner Dashboard

#### Authorization:
Role-based authorization must be enforced on the **backend**, not only in the frontend. For example, `POST /api/v1/stores` should only be accessible to an administrator. A normal user should not be able to bypass the frontend and directly call the API to create a store.

---

## 9. System Administrator Features

### 9.1 Admin Dashboard
The dashboard displays:
- Total Users
- Total Stores
- Total Ratings

The statistics must be retrieved from the backend rather than hardcoded.

### 9.2 Store Management
- Admin can add a new store.
- Store information required:
  - Store Name
  - Store Email
  - Store Address
  - Store Owner (Must be a registered user with `STORE_OWNER` role)
- The store's overall rating is calculated from submitted ratings.
- Admin can view stores in a table (Name, Email, Address, Rating).

### 9.3 User Management
- Admin can create:
  - Normal Users
  - Administrators
- User fields required:
  - Name
  - Email
  - Password
  - Address
  - Role
- Admin can view users in a table (Name, Email, Address, Role).

### 9.4 User Search & Filtering
Administrators should be able to filter users based on:
- Name
- Email
- Address
- Role

Results should update based on the applied filters.

### 9.5 Store Search & Filtering
Store listings should support searching/filtering based on:
- Name
- Email
- Address

### 9.6 Sorting
Important columns should support Ascending and Descending sorting (e.g. Name, Email). Sorting should preferably happen at the backend/database level for scalable implementation.

### 9.7 User Details
Admin can open a user's details. Information displayed:
- Name
- Email
- Address
- Role
- If the user is a **Store Owner**:
  - Store Name
  - Store Email
  - Store Address
  - Average Store Rating

---

## 10. Normal User Features

### 10.1 Registration
Normal users can create accounts. Registration fields:
- Name
- Email
- Address
- Password

After successful registration, the user can log in.

### 10.2 Store Listing
Normal users can view all registered stores. Each store card/table row displays:
- Store Name
- Address
- Overall Rating
- User's Submitted Rating
- Submit Rating option (if not rated yet)
- Modify Rating option (if already rated)

---

## 11. Store Search
Normal users can search stores using:
- Store Name
- Address

Search should support partial matches (e.g., searching "rest" could return "ABC Restaurant", "XYZ Restaurant", "Food Restro").

---

## 12. Rating System
Users can submit ratings from **1 to 5** (Allowed values: 1, 2, 3, 4, 5).
- A user should only have **one rating per store**.
- If the user submits another rating for the same store, the existing rating should be updated rather than creating another record (upsert logic).

---

## 13. Rating Calculation
The store's overall rating should be calculated from all submitted ratings (e.g., average of all ratings).
The backend/database should be treated as the source of truth for rating calculations.

---

## 14. Store Owner Features
Store owners do not register through the normal signup flow. Their accounts are created by the administrator. After logging in, the owner sees their dashboard.

### 14.1 Owner Dashboard
The dashboard displays:
- Store Name
- Average Rating
- Total Ratings
- A table of "Users who rated your store" (Name, Email, Rating).

### 14.2 Rating Users
The store owner can see users who submitted ratings for their store (User Name, User Email, Rating).
- **Security Constraint**: The owner must only be able to access ratings associated with their own store. They must not be able to access another store's ratings.

---

## 15. Password Management
All authenticated users can update their password. Required fields:
- Current Password
- New Password
- Confirm New Password

The backend must verify the current password before allowing the change.

---

## 16. Form Validation

### Name
- Minimum: 20 characters
- Maximum: 60 characters
- Validation exists on both frontend and backend.

### Address
- Maximum: 400 characters

### Password
- 8–16 characters
- At least one uppercase letter
- At least one special character

### Email
- Must follow standard email validation rules.

---

## 17. User Stories

### Administrator
- **US-01**: As an administrator, I want to log into the platform so that I can access administrative functionality.
- **US-02**: As an administrator, I want to create stores so that stores can be registered on the platform.
- **US-03**: As an administrator, I want to create users so that users can access the platform.
- **US-04**: As an administrator, I want to create admin accounts so that multiple administrators can manage the system.
- **US-05**: As an administrator, I want to see total users, stores, and ratings so that I can understand platform activity.
- **US-06**: As an administrator, I want to search and filter users so that I can quickly find specific accounts.
- **US-07**: As an administrator, I want to search and filter stores so that I can quickly find specific stores.
- **US-08**: As an administrator, I want to sort tables so that I can organize records efficiently.
- **US-09**: As an administrator, I want to view detailed user information so that I can inspect user accounts.

### Normal User
- **US-10**: As a normal user, I want to register so that I can use the platform.
- **US-11**: As a normal user, I want to log in so that I can access store-rating functionality.
- **US-12**: As a normal user, I want to search stores so that I can find stores easily.
- **US-13**: As a normal user, I want to see the overall rating of a store so that I can evaluate it.
- **US-14**: As a normal user, I want to submit a rating from 1–5 so that I can provide feedback.
- **US-15**: As a normal user, I want to modify my rating so that I can update my feedback.
- **US-16**: As a normal user, I want to see my submitted rating so that I know how I previously rated a store.
- **US-17**: As a normal user, I want to change my password so that I can maintain account security.

### Store Owner
- **US-18**: As a store owner, I want to log in so that I can access my store dashboard.
- **US-19**: As a store owner, I want to see my average rating so that I can understand customer satisfaction.
- **US-20**: As a store owner, I want to see users who rated my store so that I can understand who submitted feedback.
- **US-21**: As a store owner, I want to change my password so that I can maintain account security.

---

## 18. MVP Scope
Version 1 will include only functionality required to satisfy the assessment.

### Out of Scope / Features Not Included in Version 1:
- **Social Features**: Comments/reviews, Likes/dislikes, Following users, Social profiles.
- **Advanced Store Features**: Store photos, Store categories, Business hours, Products/services, Online ordering, Payments, Delivery tracking.
- **Advanced Rating Features**: Written reviews, Review images/videos, Rating reactions, Rating moderation system, Rating history analytics.
- **Communication**: Chat, Email notifications, SMS notifications, Push notifications.
- **Advanced Analytics**: Revenue analytics, Customer segmentation, Geographic analytics, Advanced charts, Predictive analytics.
- **Infrastructure**: Microservices, Kafka, Kubernetes, Complex event-driven architecture.
- **Other**: OAuth/social login, Forgot-password email workflow, Multi-language support, Dark mode, AI-based recommendations, Mobile applications, Subscription/payment plans.
