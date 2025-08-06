# Backend Setup & Docker Guide

## 📌 Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Node.js** (v16 or later)
- **PostgreSQL** (if running without Docker)

---

## 🚀 1. Clone the Repository

```sh
git clone https://github.com/your-repo/backend.git
cd backend
```

---

## 🛠 2. Set Up Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
# Database Configuration
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=
POSTGRES_HOST=

# API Configuration
PORT=
DATABASE_URL=
JWT_SECRET=
```

---

## 🏗 3. Install Dependencies

```sh
yarn install or npm install
```

---

##  4. Set Up  PostgreSQL

```
1.psql -U postgres
2.CREATE DATABASE booking_system;
3.\q
4.node scripts/createTables.js
5.node scripts/seedWithPool.js

### **If running PostgreSQL locally**

1. Update `.env`:

```env
DATABASE_URL=
```

2. Ensure PostgreSQL is running on your machine.

---


## 🚀 5. Start the Backend Server

```sh
npm run dev
```

This will start the backend on **http://localhost:5000**.

---

## 🔥 6. API Endpoints Testing

Use Postman or Curl to test API routes.
Example:

```sh
curl http://localhost:5000/api/health
```

---

## 🛑 Stopping Services

To stop the backend server:

```sh
CTRL + C (in terminal)
```


✅ **Now your backend and database are fully set up and ready to use!** 🚀
