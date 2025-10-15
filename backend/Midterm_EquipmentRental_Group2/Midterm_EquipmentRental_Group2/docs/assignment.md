# 🏗️ Midterm Project: Equipment Rental Management System

**Course:** Enterprise Application Development 1**Total Marks:** 30 2

---

## 📌 Instructions

- This is a **Group project**. Max allowed **3 members** in 1 team. 3
- You may use any UI technology: **ASP.NET MVC (Razor Views), React, Blazor, or mobile (MAUI/WPF)**. 4
- Follow good architectural practices (**Dependency Injection, Repository Pattern, Unit of Work**). 5
- Partial credit will be awarded for partially correct or incomplete implementations that demonstrate understanding. 6

## 💡 Scenario

You are building an **Equipment Rental Management System** for a construction company. 7

### System Capabilities

- **Admins** to manage equipment, customers, and rentals. 8
- **Users (customers)** to browse equipment, issue, and return items. 9

### Required Technologies

- **ASP.NET Core Web API** 10
- **Entity Framework Core** (SQL Server or In-Memory) 11
- **Repository + Unit of Work Pattern** 12
- **JWT Authentication & Role-Based Authorization** 13
- **Client Application** consuming the API 14

> 
> 
> 
> **Focus:** Build a working backend API first; the UI can be basic (Razor, console, or JS frontend) as long as it correctly consumes API endpoints. 15
> 

---

## Part A: API Development (20 Marks)

### 1. Authentication Endpoints (4 Marks)

| Method | Endpoint | Description | Requirements |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Authenticate user & return **JWT token with role claims**. 16 | Validate username and password from the database. 17Generate JWT token with `UserName` and `Role` claims. 18Apply `[Authorize]` and `[Authorize (Roles = 'Admin')]`. 19Redirect UI based on role (Admin → Admin Dashboard, User → User Dashboard). 20 |

> 
> 
> 
> **Seeding:** Seed the database with one **Admin** and multiple **Users** for testing authentication and role-based access. 21**Marks:** JWT logic (2) + Role authorization (1) + UI integration (1) 22
> 

---

### 2. Equipment Management Endpoints (6 Marks)

| Method | Endpoint | Description | Admin | User | UI Appearance (Summary) |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/equipment` | Get all equipment (Index page) 23 | ✅ | ✅ | Responsive Table: Name, Category, Condition, Status. Admin sees Create/Edit/Delete; User sees Details only. 24 |
| `GET` | `/api/equipment/{id}` | Get specific equipment (Details page) 25 | ✅ | ✅ | Details Card: Image placeholder, specs, condition, status. Admin sees Edit/Delete + Rental History; User sees 'Issue Equipment' if available. 26 |
| `POST` | `/api/equipment` | Add new equipment (Create form) 27 | ✅ | ❌ | Create Form: Fields for Name, Category, Condition, Description; Save/Cancel buttons. 28 |
| `PUT` | `/api/equipment/{id}` | Update equipment (Edit form) 29 | ✅ | ❌ | Pre-filled form; Update/Cancel buttons; success message redirect. 30 |
| `DELETE` | `/api/equipment/{id}` | Delete equipment (Index button) 31 | ✅ | ❌ | Confirmation Modal: 'Yes/Cancel' dialog with success toast. 32 |
| `GET` | `/api/equipment/available` | List available equipment (Issue dropdown) 33 | ✅ | ✅ | Dropdown: Available items enabled, others marked 'Not Available'. 34 |
| `GET` | `/api/equipment/rented` | Get rented equipment (Admin Dashboard) 35 | ✅ | ❌ | Dashboard Card: Orange card showing 'X Rented Equipment', clickable to list. 36 |

### Equipment Data

- 
    
    **Categories:** Heavy Machinery, Power Tools, Vehicles, Safety, Surveying 37
    
- 
    
    **Conditions:** New, Excellent, Good, Fair, Poor 38
    

### Business Rules

- Equipment can only be **issued if available**. When returned, `IsAvailable = true`. 39
- **Users can only have one active rental** at a time. Admins can override or cancel rentals. 40

> 
> 
> 
> **Marks:** CRUD (3) + Business rules (2) + Authorization (1) 41
> 

---

### 3. Customer Management Endpoints (4 Marks)

| Method | Endpoint | Description | Admin | User | UI Appearance (Summary) |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/customers` | List all customers (Index page) 42 | ✅ | ❌ | Table: Name, Username, Role, Active Rental columns; Create/Edit/Delete/View actions. 43 |
| `GET` | `/api/customers/{id}` | Get customer details (Details page) 44 | ✅ | * 45 | Profile Card: Info + rental history. Admin sees all; User sees own data. 46 |
| `POST` | `/api/customers` | Create customer (Form) 47 | ✅ | ❌ | Form: Name, Username, Password, Role (Admin/User). 48 |
| `PUT` | `/api/customers/{id}` | Update customer (Edit form) 49 | ✅ | * 50 | Edit Form: Admin can edit role; User can edit Name/Password. 51 |
| `DELETE` | `/api/customers/{id}` | Delete customer (Index) 52 | ✅ | ❌ | Modal: 'Delete customer and history?' Yes/Cancel. 53 |
| `GET` | `/api/customers/{id}/rentals` | Get customer rental history (My Rentals) 54 | ✅ | * 55 | Table: Equipment, Issue Date, Return Date, Status. 56 |
| `GET` | `/api/customers/{id}/active-rental` | Check active rental (Dashboard) 57 | ✅ | * 58 | Active Rental Card: Current equipment, issue date, due date, Return button. 59 |

> * Users can only access their own data. 60Marks: Endpoints (2) + Role filtering (1) + Validation (1) 61
> 

---

### 4. Rental Management Endpoints (6 Marks)

| Method | Endpoint | Description | Admin | User | UI Appearance (Summary) |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/rentals` | Get all rentals (Index page) 6262 | ✅ | * 6363 | Table: Equipment, Customer, Issue Date, Status. Admin sees all; User sees own only. 6464 |
| `GET` | `/api/rentals/{id}` | Get rental details (Details page) 6565 | ✅ | * 6666 | Details Card: Equipment & member info, timestamps, status badge. 6767 |
| `POST` | `/api/rentals/issue` | Issue equipment (Form) 6868 | ✅ | * 6969 | Form: Equipment dropdown, Customer (Admin), Issue button. 7070 |
| `POST` | `/api/rentals/return` | Return equipment (Form) 7171 | ✅ | * 7272 | Form: Rental info, Condition dropdown, Notes, Return button. 7373 |
| `GET` | `/api/rentals/active` | Get active rentals 7474 | ✅ | * 7575 | Grid: Equipment image, days rented, 'View Details'. 7676 |
| `GET` | `/api/rentals/completed` | Get completed rentals 7777 | ✅ | * 7878 | Table: Return date, duration, status badge. 7979 |
| `GET` | `/api/rentals/overdue` | Get overdue rentals 80 | ✅ | ❌ | Alert Table: Red highlight for overdue; 'Force Return' buttons. 81818181 |
| `GET` | `/api/rentals/equipment/{equipmentId}` | Equipment rental history 82 | ✅ | ✅ | Timeline: All rentals for selected equipment. 83838383 |
| `PUT` | `/api/rentals/{id}` | Extend rental 84 | ✅ | ❌ 85 | Form: Due date picker, extension reason, 'Extend Rental'. 86868686 |
| `DELETE` | `/api/rentals/{id}` | Cancel rental 87 | ✅ | ❌ 88 | Modal: 'Force return equipment ?' Red confirm button. 89898989 |

> * Users see only their own rentals 90and can only issue/return their own equipment91.
> 

### Business Rules

- Each user can have only **one active rental** at a time. 92
- Equipment status updates on issue/return. 93
- 
    
    **Admins can cancel or force-return rentals.** 94
    
- 
    
    **Overdue** is defined as `DueDate < DateTime.Now && ReturnedAt == null`. 95
    

> 
> 
> 
> **Marks:** Endpoints (2) + Logic (2) + Access (1) + UI integration (1) 96
> 

---

## Part B: Client Application (7 Marks)

- 
    
    **Technology:** Students may use MVC, React, Angular, Blazor, or WPF. 97
    

### Feature Summary

- **Login Page:** Authenticate via JWT; redirect to dashboard (Both) 98
- **Admin Dashboard:** Manage equipment, customers, rentals, overdue (Admin) 99
- **User Dashboard:** Browse available equipment + manage rentals (User) 100
- **Equipment Pages:** CRUD for Admin, Details/Issue for User 101
- **Customer Pages:** Manage customers (Admin) / Update profile (User) 102
- **Rental Pages:** Issue, return, extend, or cancel rentals 103
- **Validation & Feedback:** Client + server validation; modals/toasts for messages 104

> 
> 
> 
> **Marks:** Authentication (1) + Equipment UI (1) + Rental workflow (2) + Role-based UX (1) + Design polish (1) + Validation & Feedback (1) 105
> 

---

## Part C: Project Demo Video (3 Marks)

- Each team must submit a short, recorded demo (**2-5 minutes**) showcasing key features. 106
- Narration must be audible, and screen text legible. 107

### Video Content

- Authentication flow (login as Admin and User) 108
- Dashboard overview (Admin and User differences) 109
- Equipment management (add/edit/delete or issue/return) 110
- Rental process demonstration (issue → return → overdue handling) 111
- Brief architecture explanation (how DI, Repository, and UoW are used) 112

### Submission Format

- Upload to **Clipchamp** and generate a shareable link. 113
- Include the link in your **README.md** or eConestoga submission comment. 114114114

### Marks Breakdown

- Functional demo and completeness (1.5) 115
- Clear narration / explanation (1) 116
- Professional presentation and flow (0.5) 117

---

## 📈 Grading Rubric

| Range | Grade | Description |
| --- | --- | --- |
| 27-30 | **A+** | Production-ready API + UI with clean architecture and role-based security. 118 |
| 24-26 | **A** | All features functional; minor UI or logic issues. 119 |
| 20-23 | **B** | Core API works; partial UI or incomplete business rules. 120 |
| 16-19 | **C** | Limited features; weak JWT or incomplete integration. 121 |
| < 16 | **F** | Major features missing or broken architecture. 122 |

---

## ⚙️ Proposed Project Structure

| Folder | File | Description |
| --- | --- | --- |
| `Controllers` | `AuthController.cs` | Handles login and inline JWT generation (Admin/User) 123 |
| `Controllers` | `EquipmentController.cs` | CRUD + available/rented queries 124 |
| `Controllers` | `CustomerController.cs` | CRUD + role-based access 125 |
| `Controllers` | `RentalController.cs` | Issue, return, extend, cancel rentals 126 |
| `Models` | `Equipment.cs` | Id, Name, Description, Category, Condition, RentalPrice, IsAvailable, CreatedAt 127 |
| `Models` | `Customer.cs` | Id, Name, Email, UserName, Password, Role ('Admin'/'User') 128 |
| `Models` | `Rental.cs` | Id, EquipmentId, CustomerId, IssuedAt, ReturnedAt 129 |
| `Data` | `AppDbContext.cs` | EF Core In-Memory DbContext + Seed Data 130 |
| `Repositories` | `Interfaces/*.cs` | Repository interfaces for entities 131 |
| `Repositories` | `Repository.cs` | Generic CRUD implementation 132 |
| `Repositories` | `EquipmentRepository.cs` | Equipment-specific data logic 133 |
| `Repositories` | `CustomerRepository.cs` | Customer-specific data logic 134 |
| `Repositories` | `RentalRepository.cs` | Rental-specific data logic 135 |
| `UnitOfWork` | `IUnitOfWork.cs / UnitOfWork.cs` | Coordinates all repositories 136 |
| `(root)` | `Program.cs` | Registers DbContext, Repos, UoW, Swagger 137 |
| `(root)` | `EquipmentRental.API.csproj` | Project definition 138 |

---

## ✅ Submission Requirements

1. **Solution Folder Name:** `Midterm_EquipmentRental_<TeamName>` (e.g., `Midterm_EquipmentRental_TeamA`) 139139139139
2. **Submission:** Submit a zipped Visual Studio solution folder. 140
3. **README.md File:** Must include: 141
    - Setup instructions (how to run API and UI). 142
    - Default credentials for Admin and User accounts. 143
4. **Database Seeding:** 144
    - Minimum **5 equipment items** (different categories & conditions). 145
    - 
        
        **1 Admin** and **5 Users**. 146
        
    - A few **active and completed rentals** for demonstration. 147
5. **Execution:** Ensure both API and UI run successfully **without code modification**. 148
6. **Video Link:** If submitting a video demo, include your Clipchamp share link in the README or eConestoga submission comment. 149

---

## ✨ Tip for Success

- Start with **API** → Test endpoints in **Swagger** → then build **UI**. 150
- Use **Dependency Injection** and **Repositories** correctly. 151
- Test **JWT authorization** early. 152
- Record your demo after full flow is working. 153

---

## 🤖 AI Usage Policy (Updated)

- Students may use AI tools (e.g., ChatGPT, GitHub Copilot) to assist with **front-end/UI code** (e.g., generating Bootstrap layouts, Razor markup, or minor React/Blazor components). 154
- **Backend logic** (Controllers, Repositories, Unit of Work, DbContext, JWT logic, etc.) **must be fully written and understood by the student/team.** 155
- You must understand and be able to explain all submitted code during review. 156
- If AI assistance was used, clearly mention it in your **README.md** under a section titled "**AI Assistance Used**" (e.g., "Used ChatGPT to generate HTML layout for Equipment Details page"). 157
- Submissions that contain copy-pasted AI code or show lack of understanding will lead to mark deductions or an academic integrity review. 158

That's a great idea! I'll reformat the provided project description into a clean, Notion-like Markdown note, keeping all the original content and structure.