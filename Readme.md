#  Finance Tracker

A full-stack personal finance management application built with **React (Vite)** on the frontend and **Spring Boot (Java)** on the backend. Track your income and expenses, categorize transactions, set monthly budgets, and visualize your spending with charts.

---

##  Features

- **User Authentication** — Register and login with JWT-based security
- **Transaction Management** — Add, edit, and delete income/expense transactions
- **Category System** — Pre-seeded categories (Salary, Food, Rent, Transport, etc.)
- **Dashboard** — Pie chart of expenses by category with income/expense/balance summary
- **Monthly Budget** — Set a monthly budget and track status (Safe / Warning / Danger)
- **Protected Routes** — Pages are accessible only to authenticated users
- **Auto Logout** — Automatically redirects to login on token expiry (401)

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP requests with JWT interceptor |
| Recharts | Pie chart visualization |
| CSS Modules | Component-scoped styling |

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3 | REST API framework |
| Spring Security | Authentication and authorization |
| JWT (jjwt) | Token generation and validation |
| Spring Data JPA | Database ORM |
| MySQL | Relational database |
| Lombok | Boilerplate reduction |

---

##  Project Structure

```
finance-tracker/
├── Backend/
│   └── src/main/java/com/backend/
│       ├── config/          # DataInitializer (seeds default categories)
│       ├── controller/      # AuthController, TransactionController, UserController, CategoryController
│       ├── dto/             # LoginRequest, LoginResponse, RegisterRequest, SummaryResponse
│       ├── entity/          # User, Transaction, Category
│       ├── repository/      # JPA repositories
│       ├── security/        # JWT filter, JwtUtil, SecurityConfig, CustomUserDetailsService
│       └── service/         # TransactionService, UserService
│
└── Frontend/
    └── src/
        ├── api/             # authService, transactionService, userService, axiosInstance
        ├── components/      # Navbar, ProtectedRoute
        ├── pages/           # LoginPage, RegisterPage, DashboardPage, TransactionPage
        ├── App.jsx          # Route definitions
        ├── App.css          # Shared styles (buttons, cards, forms)
        └── index.css        # Global styles and CSS variables
```

---

##  Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

###  Database Setup

1. Open MySQL and create the database:

```sql
CREATE DATABASE finance_tracker;
```

2. Configure your credentials in `Backend/src/main/resources/application.properties`. You can either replace the placeholders with your actual values, or set them as environment variables (`DB_PASSWORD` and `JWT_SECRET`):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_tracker
spring.datasource.username=your_mysql_username
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
spring.jpa.hibernate.ddl-auto=update
```


###  Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Run with Maven
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**

On first startup, the `DataInitializer` automatically seeds the following categories into the database:

| Category | Type |
|---|---|
| Salary | INCOME |
| Rent | EXPENSE |
| Food | EXPENSE |
| Transport | EXPENSE |
| Shopping | EXPENSE |
| Entertainment | EXPENSE |
| Health | EXPENSE |
| Others | EXPENSE |

---

###  Frontend Setup

```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts on **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |

### Transactions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/transactions` | Protected | Get all transactions for logged-in user |
| GET | `/api/transactions?month=YYYY-MM` | Protected | Get transactions filtered by month |
| POST | `/api/transactions` | Protected | Create a new transaction |
| PUT | `/api/transactions/{id}` | Protected | Update an existing transaction |
| DELETE | `/api/transactions/{id}` | Protected | Delete a transaction (owner only) |
| GET | `/api/transactions/summary?yearMonth=YYYY-MM` | Protected | Get monthly income/expense summary and budget status |

### Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories` | Protected | Get all available categories |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/{userId}` | Protected | Get user details |
| PUT | `/api/users/{userId}` | Protected | Update monthly budget |

---

##  Authentication Flow

1. User registers or logs in via `/api/auth/login`
2. Backend returns a `LoginResponse` containing `token`, `userId`, `email`, and `name`
3. Frontend stores `token` and `userId` in `localStorage`
4. Every subsequent request attaches the token as `Authorization: Bearer <token>`
5. On 401 response, the frontend clears storage and redirects to `/login`
6. Protected routes check for token presence via `ProtectedRoute` component

---

##  Budget Status Logic

The `/api/transactions/summary` endpoint calculates a budget status for the current month:

| Status | Condition |
|---|---|
| `safe` | Expenses are below 80% of monthly budget |
| `warning` | Expenses are between 80% and 100% of monthly budget |
| `danger` | Expenses have exceeded the monthly budget |

If no budget is set, the status defaults to `safe`.

---


##  License

This project is for educational purposes.