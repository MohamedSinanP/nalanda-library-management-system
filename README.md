# Nalanda Library Management System

Welcome to the **Nalanda Library Management System**, a full-stack library management system built as part of the backend developer task for **Heumn Interactive Private Limited**.

This repository contains both the **backend (REST API)** and the **frontend (React + Redux)** for managing users, books, borrowing, and reporting.

---

## Architecture

- **Backend**: Node.js + Express.js + MongoDB
  - Repository Pattern for data access
  - SOLID principles for clean, maintainable code
  - Controller-Service-Repository structure
  - RESTful API endpoints
  - JWT authentication with AES encryption
  - Role-based access control (Admin & Member)
- **Frontend**: React + Redux Toolkit
  - Responsive UI with React components
  - State management with Redux
  - Tailwind CSS for styling
  - Integration with backend APIs

---

## Features

### User Management

- User registration and login
- Role-based access control
- JWT-based authentication

### Book Management (Admin only)

- Add, update, delete books
- View all books with pagination & filtering

### Borrowing System (Members)

- Borrow and return books
- View personal borrow history

### Reports (General)

- Most borrowed books
- Active members
- Book availability summary

---

## Tech Stack

### Backend

- Node.js, Express.js
- MongoDB + Mongoose
- JWT Authentication with AES encryption
- Repository Pattern + SOLID Principles
- TypeScript

### Frontend

- React.js
- Redux Toolkit
- Tailwind CSS
- EJS (optional, if used for templates)
- Axios for API calls

---

## Project Structure

Library-management-system/
├── server/ # Node.js + Express backend
├── client/ # React frontend
└── README.md

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MohamedSinanP/inventory-management.git
cd inventory-management
```

### 2. Setup Backend

```bash
cd server
npm install
```

#### Create a .env file in the backend/ directory and add your environment variables:

```ini
PORT=3000
MONGO_URI="your datase url cloud (atlas) or local"
JWT_ACCESS_SECRET="your jwt access secret"
JWT_REFRESH_SECRET="your jwt refresh secret"
NODE_ENV="developement"
CLIENT_URL="http://localhost:5173"
```

#### Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

#### Create a .env file in the frontend/ directory and add your environment variable:

```ini
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Start the frontend server:

```bash
npm run dev
```

- Frontend will run at http://localhost:5173

### 4. Prerequisites

- Make sure you have Node.js installed (v18+ recommended).
- MongoDB should be running locally or use MongoDB Atlas.

---

## 📡 REST API Endpoints

### Auth Routes

| Method | Endpoint                | Access Role   | Description                   |
| ------ | ----------------------- | ------------- | ----------------------------- |
| POST   | /api/auth/signup        | Public        | Register a new user           |
| POST   | /api/auth/login         | Public        | Login with email and password |
| POST   | /api/auth/refresh-token | Public        | Rotate refresh token          |
| POST   | /api/auth/logout        | Admin, Member | Logout current user           |

---

### Book Routes

| Method | Endpoint              | Access Role | Description                 |
| ------ | --------------------- | ----------- | --------------------------- |
| GET    | /api/books            | Public      | Get list of books           |
| GET    | /api/books/genres     | Public      | Get list of genres          |
| GET    | /api/books/authors    | Public      | Get list of authors         |
| GET    | /api/books/admin-book | Admin       | List all books (admin view) |
| POST   | /api/books            | Admin       | Add a new book              |
| PUT    | /api/books/:id        | Admin       | Update book details         |
| DELETE | /api/books/:id        | Admin       | Delete a book               |

---

### Borrow Routes

| Method | Endpoint        | Access Role | Description                  |
| ------ | --------------- | ----------- | ---------------------------- |
| POST   | /api/borrow/:id | Member      | Borrow a book                |
| POST   | /api/return/:id | Member      | Return a borrowed book       |
| GET    | /api/history    | Member      | Get member borrow history    |
| GET    | /api/status     | Member      | Get status of borrowed books |

---

### Report Routes

| Method | Endpoint                       | Access Role | Description                   |
| ------ | ------------------------------ | ----------- | ----------------------------- |
| GET    | /api/reports/most-borrowed     | Public      | Get most borrowed books       |
| GET    | /api/reports/active-members    | Public      | Get most active members       |
| GET    | /api/reports/book-availability | Public      | Get book availability summary |

## License

MIT License

---

## Author

Created by Mohamed Sinan P
