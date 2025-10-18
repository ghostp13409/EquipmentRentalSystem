# Equipment Rental System - Group 2

## Overview

The Equipment Rental System is a web application designed to manage the rental of various equipment items to customers. The system provides functionalities for user authentication, customer management, equipment inventory management, and rental processing. It is built using ASP.NET Core for the backend and React with TypeScript for the frontend.

## How to Run the Application

### Install Dependencies

In root folder run:

```bash
./init
```

### Start the Application

From the root folder run:

```bash
./start
```

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint          | Description   | Auth Required |
| ------ | ----------------- | ------------- | ------------- |
| POST   | `/api/auth/login` | Login user    | No            |
| GET    | `/api/auth/users` | Get all users | No            |

### Customer Endpoints

| Method | Endpoint                           | Description          | Auth Required      |
| ------ | ---------------------------------- | -------------------- | ------------------ |
| GET    | `/api/customer`                    | Get all customers    | Admin              |
| GET    | `/api/customer/{id}`               | Get customer by ID   | User (own) / Admin |
| GET    | `/api/customer/{id}/rentals`       | Get customer rentals | User (own) / Admin |
| GET    | `/api/customer/{id}/active-rental` | Get active rental    | User (own) / Admin |
| POST   | `/api/customer`                    | Create customer      | Admin              |
| PUT    | `/api/customer/{id}`               | Update customer      | User (own) / Admin |
| DELETE | `/api/customer/{id}`               | Delete customer      | Admin              |

### Equipment Endpoints

| Method | Endpoint                   | Description             | Auth Required |
| ------ | -------------------------- | ----------------------- | ------------- |
| GET    | `/api/equipment`           | Get all equipment       | User / Admin  |
| GET    | `/api/equipment/{id}`      | Get equipment by ID     | User / Admin  |
| GET    | `/api/equipment/available` | Get available equipment | User / Admin  |
| GET    | `/api/equipment/rented`    | Get rented equipment    | Admin         |
| POST   | `/api/equipment`           | Create equipment        | Admin         |
| PUT    | `/api/equipment/{id}`      | Update equipment        | Admin         |
| DELETE | `/api/equipment/{id}`      | Delete equipment        | Admin         |

### Rental Endpoints

| Method | Endpoint                     | Description           | Auth Required            |
| ------ | ---------------------------- | --------------------- | ------------------------ |
| GET    | `/api/rental`                | Get all rentals       | User (own) / Admin (all) |
| GET    | `/api/rental/{id}`           | Get rental by ID      | User (own) / Admin       |
| GET    | `/api/rental/active`         | Get active rentals    | User (own) / Admin (all) |
| GET    | `/api/rental/completed`      | Get completed rentals | User (own) / Admin (all) |
| GET    | `/api/rental/overdue`        | Get overdue rentals   | Admin                    |
| GET    | `/api/rental/equipment/{id}` | Get equipment history | User / Admin             |
| POST   | `/api/rental/issue`          | Issue equipment       | User / Admin             |
| POST   | `/api/rental/return`         | Return equipment      | User (own) / Admin       |
| PUT    | `/api/rental/{id}`           | Extend rental         | Admin                    |
| DELETE | `/api/rental/{id}`           | Cancel rental         | Admin                    |

---

## Backend Project Structure

### Backend Structure

The backend is built with ASP.NET Core and follows a layered architecture:

- **Controllers/**: Contains API controllers that handle HTTP requests and responses for authentication, customers, equipment, and rentals.
- **Data/**: Houses the Entity Framework database context (`AppDbContext.cs`) for data access.
- **DTOs/**: Defines Data Transfer Objects for request/response models, ensuring clean API contracts.
- **Models/**: Contains entity models (`Customer.cs`, `Equipment.cs`, `Rental.cs`) and enums representing the domain objects.
- **Repositories/**: Implements the Repository pattern with interfaces and concrete classes for data operations on customers, equipment, and rentals.
- **UnitOfWork/**: Provides the Unit of Work pattern to manage database transactions and ensure data consistency.

### Frontend Structure

The frontend is a React application built with TypeScript and Vite, providing a user interface for the Equipment Rental System:

- **src/components/**: Reusable UI components (buttons, modals, forms, auth forms, common utilities)
- **src/pages/**: Page components for different routes (dashboard, equipment management, customer management, rentals, profile)
- **src/services/**: API service functions for backend communication (auth, equipment, customers, rentals)
- **src/context/**: React context providers for global state management (authentication, theme, sidebar)
- **src/hooks/**: Custom React hooks for shared logic
- **src/layout/**: Layout components (header, sidebar, main app layout)
- **src/icons/**: SVG icon components
- **public/**: Static assets (images, favicon, logos)
- **src/App.tsx**: Main app component with routing
- **src/main.tsx**: Application entry point

### AI Usage

- Configure CORS
- Seed More data for testing
- Configuring React Project in Visual Studio
