# 📦 Inventory Management API

This project is a TypeScript-based backend API for managing inventory. It provides endpoints for CRUD operations, inventory analytics, system information, activity logging, and expiry alerts.

---

## 🚀 Features

- Create, Read, Update, and Delete (CRUD) inventory items
- View inventory statistics (total items, expiring soon, out of stock)
- Analyze inventory by temperature and category
- Get expiry alerts for perishable items
- Fetch system information (app version, DB status, storage usage)
- Track user actions with activity logs
- Unit and integration tested for reliability

---

## 🗂️ Project Structure

```
package.json
├── package-lock.json
├── prisma
│   └── schema.prisma
├── src
│   ├── index.ts
│   ├── routes
│   │   └── api
│   │       └── index.ts
│   └── utils
│       ├── index.ts
│       └── zod.ts
├── tests
│   ├── basic curl
│   │   └── t
│   └── routes
│       └── inventory.test.ts
└── tsconfig.json
```

---

## 🧱 Database Schema

### 📦 Inventory

Stores inventory item details.

| Field        | Type    | Description                 |
|--------------|---------|-----------------------------|
| id           | Int     | Unique identifier           |
| name         | String  | Item name                   |
| category     | String  | Category of the item        |
| stock        | Int     | Current stock level         |
| min_stock    | Int     | Minimum stock threshold     |
| price        | Float   | Price of the item           |
| status       | String  | Item availability status    |
| supplier     | String  | Name of supplier            |
| expiry_date  | Date    | Expiry date of item         |
| temperature  | Float   | Ideal storage temperature   |

### 🖥️ SystemInfo

Stores system-level operational data.

| Field         | Type   | Description                  |
|---------------|--------|------------------------------|
| id            | Int    | Unique identifier            |
| version       | String | Application version          |
| db_status     | String | Database connection status   |
| last_backup   | Date   | Last backup timestamp        |
| storage_usage | Float  | Current storage usage        |

### 📝 ActivityLogs

Tracks user activity.

| Field     | Type   | Description                  |
|-----------|--------|------------------------------|
| id        | Int    | Unique log identifier        |
| action    | String | Action performed             |
| user_id   | Int    | ID of user who did the action|
| timestamp | Date   | Time of the action           |

---

## 🔌 API Endpoints

### Inventory Endpoints

| Method | Endpoint                                       | Description                              |
|--------|------------------------------------------------|------------------------------------------|
| GET    | `/api/inventory`                               | List all inventory items                 |
| POST   | `/api/inventory`                               | Create a new inventory item              |
| GET    | `/api/inventory/:id`                           | Get details of a specific inventory item |
| PUT    | `/api/inventory/:id`                           | Update a specific inventory item         |
| DELETE | `/api/inventory/:id`                           | Delete a specific inventory item         |
| GET    | `/api/inventory/stats`                         | Fetch inventory summary statistics       |
| GET    | `/api/inventory/expiring-soon`                 | List items that are expiring soon        |
| GET    | `/api/inventory/temperature-distribution`      | Get distribution by temperature          |
| GET    | `/api/inventory/category-distribution`         | Get distribution by category             |

### System Information Endpoints

| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| GET    | `/api/system/info`  | Retrieve system info and status |

### Activity Log Endpoints

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/activity/log`   | Fetch user activity logs        |

---

## ✅ Deliverables

- ✔ Inventory management APIs (CRUD)
- ✔ Analytics APIs (temperature, category)
- ✔ Expiry alert APIs
- ✔ System information API
- ✔ Activity logging API
- ✔ Fully tested with unit and integration tests

---

## 🧪 Running Tests

Tests are written using `jest` and `supertest`.

To run all tests:

```bash
npm test
```

---

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Backend Framework**: Express.js
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Jest, Supertest

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

- Create a `.env` file with necessary environment variables.
- Set up your database using Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run the development server

```bash
cd backend/src
nodemon index.ts
```

Server should now be running at `http://localhost:3001`
---
