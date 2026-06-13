# Equipment Rental System (ERS)

### _A Modern, Full-Stack Solution for Real-Time Equipment Management_

The **Equipment Rental System (ERS)** is a robust, enterprise-grade application designed to streamline the lifecycle of equipment rentals. From heavy machinery to precision tools, ERS provides a seamless experience for both administrators and customers, featuring real-time communication, secure authentication, and modern data visualization.

---

## Key Features

### Real-Time Communication

- **SignalR Integration**: Instant messaging between administrators and customers for every active rental.
- **Dynamic Grouping**: Secure, rental-specific chat rooms ensure privacy and message relevance.
- **Live Updates**: Instant notification delivery across all connected clients.

### Ephemeral Messaging System

- **Auto-Cleanup**: A dedicated backend **Background Service** (`MessageCleanupService`) monitors and purges messages every 10 seconds.
- **Expiry Logic**: Messages older than 60 seconds are automatically deleted to maintain a clean, ephemeral chat environment.
- **Privacy-First**: Sensitive communication is kept temporary and stored in-memory.

### Enterprise-Grade Security

- **Dual Authentication**: Support for traditional credentials and **Google OAuth 2.0 Integration**.
- **Secure API Access**: Implementation of **JWT (JSON Web Tokens)** for stateless, secure communication.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions (Admin/User) enforced via dynamic claim transformation.

### Rental Lifecycle Management

- **Lifecycle Tracking**: Full management of Issue, Return, and Extension phases.
- **Condition Monitoring**: Tracking equipment health (Good, Excellent, Fair, Poor) throughout the rental lifecycle.
- **Smart Due Dates**: Visual indicators for active, completed, and overdue rentals.

### Advanced Data Visualization

- **Interactive Dashboard**: Real-time analytics using **ApexCharts** to monitor equipment utilization and rental trends.
- **Scheduling & Planning**: Comprehensive **FullCalendar** integration for viewing rental timelines and equipment availability.

---

## Tech Stack

### Backend (ASP.NET Core)

- **Framework**: .NET 8.0 Web API
- **Real-Time**: SignalR
- **Data Access**: Entity Framework Core (with In-Memory Database support)
- **Patterns**: Repository Pattern & Unit of Work for a clean, maintainable architecture.
- **Security**: JWT Authentication, Google OAuth 2.0, Role-Based Authorization.
- **Documentation**: Swagger/OpenAPI for interactive API testing.

### Frontend (React & TypeScript)

- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS 4.0 (Modern, utility-first CSS)
- **Build Tool**: Vite (Lightning-fast development environment)
- **State Management**: React Context API (Auth, Theme, Sidebar)
- **Libraries**:
  - **ApexCharts** for data visualization.
  - **FullCalendar** for scheduling.
  - **React Router 7** for declarative routing.
  - **React Hot Toast** for elegant notifications.

---

## System Architecture

The project follows a decoupled, service-oriented architecture:

1.  **Presentation Layer (Client)**: A modern React application communicating via a stateless REST API.
2.  **API Layer (Backend)**: ASP.NET Core controllers handling requests, enforcing security policies, and managing SignalR connections.
3.  **Domain/Data Layer**: Clean separation of models, DTOs, and data access through Repositories and a Unit of Work.
4.  **Infrastructure**: Background workers for automated tasks like message cleanup and JWT management.

---

## Project Structure

### Backend (`/backend`)

- **Controllers/**: API Endpoints for Auth, Customers, Equipment, and Rentals.
- **Data/**: DB Context and Seed data.
- **Repositories/**: Data access implementation (following Repository Pattern).
- **Services/**: JWT minting, Google OAuth clients, and Background Services.
- **Models/DTOs**: Domain models and Data Transfer Objects for decoupled communication.

### Client (`/client`)

- **src/components/**: Reusable UI components (Modals, Forms, Tables).
- **src/pages/**: High-level page components (Dashboard, Management, Profile).
- **src/services/**: API integration layer and SignalR client setup.
- **src/context/**: Global state providers for Auth, Theme, and Layout.
- **src/hooks/**: Custom hooks for shared logic.

---

## Getting Started

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd EquipmentRentalSystem
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```

3. **Setup Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## License

This project is for educational/demonstration purposes.
