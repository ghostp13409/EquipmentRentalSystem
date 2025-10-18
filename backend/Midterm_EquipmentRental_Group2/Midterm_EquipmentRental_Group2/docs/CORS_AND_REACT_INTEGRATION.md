# CORS and React Frontend Integration Guide

## Overview

This document explains the CORS (Cross-Origin Resource Sharing) configuration implemented in the Equipment Rental System API and provides guidance for integrating with a React frontend.

---

## What Was Configured

### 1. CORS Policy (`Program.cs`)

The API now includes a flexible CORS policy called **"ReactAppPolicy"** that:

- ✅ **Allows all localhost origins** with any port (e.g., `http://localhost:3000`, `http://localhost:5173`)
- ✅ **Allows all HTTP methods** (GET, POST, PUT, DELETE, OPTIONS)
- ✅ **Allows all headers** including `Authorization` for JWT tokens
- ✅ **Allows credentials** for cookie-based authentication
- ✅ **Exposes custom headers** like `Content-Disposition` and `X-Pagination`

### 2. JSON Serialization

The API automatically converts between .NET conventions and JavaScript conventions:

**Backend (.NET):**

```csharp
public class Customer {
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

**Frontend (JSON Response):**

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe"
}
```

**Additional JSON Features:**

- ✅ Enums are serialized as strings (e.g., `"Active"` instead of `0`)
- ✅ Null values are omitted from responses
- ✅ Circular references are handled automatically
- ✅ Pretty-printed JSON for easier debugging

### 3. Middleware Order

The middleware pipeline is configured in the correct order:

```
1. CORS          ← Must be BEFORE authentication
2. Authentication
3. Authorization
4. Controllers
```

---

## React Frontend Integration

### API Base URL

Set up your API base URL in your React app:

```javascript
// src/config/api.js
export const API_BASE_URL = "http://localhost:5000/api"; // Adjust port as needed
```

### Authentication Setup

#### 1. Login Example

```javascript
// src/services/authService.js
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });

    const { token, role } = response.data;

    // Store token in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    return { token, role };
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRole = () => {
  return localStorage.getItem("role");
};
```

#### 2. Axios Interceptor for JWT

Create an axios instance with automatic token injection:

```javascript
// src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken, logout } from "./authService";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Examples

#### Customer Service

```javascript
// src/services/customerService.js
import api from "./api";

export const customerService = {
  // Get all customers (Admin only)
  getAll: async () => {
    const response = await api.get("/customer");
    return response.data;
  },

  // Get customer by ID
  getById: async (id) => {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  },

  // Get customer's rentals
  getRentals: async (customerId) => {
    const response = await api.get(`/customer/${customerId}/rentals`);
    return response.data;
  },

  // Get customer's active rental
  getActiveRental: async (customerId) => {
    const response = await api.get(`/customer/${customerId}/active-rental`);
    return response.data;
  },

  // Create customer (Admin only)
  create: async (customer) => {
    const response = await api.post("/customer", customer);
    return response.data;
  },

  // Update customer
  update: async (id, customer) => {
    const response = await api.put(`/customer/${id}`, customer);
    return response.data;
  },

  // Delete customer (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/customer/${id}`);
    return response.data;
  },
};
```

#### Equipment Service

```javascript
// src/services/equipmentService.js
import api from "./api";

export const equipmentService = {
  // Get all equipment
  getAll: async () => {
    const response = await api.get("/equipment");
    return response.data;
  },

  // Get equipment by ID
  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  // Get available equipment
  getAvailable: async () => {
    const response = await api.get("/equipment/available");
    return response.data;
  },

  // Get rented equipment (Admin only)
  getRented: async () => {
    const response = await api.get("/equipment/rented");
    return response.data;
  },

  // Create equipment (Admin only)
  create: async (equipment) => {
    const response = await api.post("/equipment", equipment);
    return response.data;
  },

  // Update equipment (Admin only)
  update: async (id, equipment) => {
    const response = await api.put(`/equipment/${id}`, equipment);
    return response.data;
  },

  // Delete equipment (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },
};
```

#### Rental Service

```javascript
// src/services/rentalService.js
import api from "./api";

export const rentalService = {
  // Get all rentals (Admin sees all, User sees their own)
  getAll: async () => {
    const response = await api.get("/rental");
    return response.data;
  },

  // Get rental by ID
  getById: async (id) => {
    const response = await api.get(`/rental/${id}`);
    return response.data;
  },

  // Get active rentals
  getActive: async () => {
    const response = await api.get("/rental/active");
    return response.data;
  },

  // Get completed rentals
  getCompleted: async () => {
    const response = await api.get("/rental/completed");
    return response.data;
  },

  // Get overdue rentals (Admin only)
  getOverdue: async () => {
    const response = await api.get("/rental/overdue");
    return response.data;
  },

  // Get equipment rental history
  getEquipmentHistory: async (equipmentId) => {
    const response = await api.get(`/rental/equipment/${equipmentId}`);
    return response.data;
  },

  // Issue equipment (create rental)
  issue: async (rental) => {
    const response = await api.post("/rental/issue", rental);
    return response.data;
  },

  // Return equipment
  return: async (rentalId, conditionOnReturn, notes = "") => {
    const response = await api.post("/rental/return", {
      rentalId,
      conditionOnReturn,
      notes,
    });
    return response.data;
  },

  // Extend rental (Admin only)
  extend: async (rentalId, newDueDate) => {
    const response = await api.put(`/rental/${rentalId}`, {
      newDueDate,
    });
    return response.data;
  },

  // Cancel rental (Admin only)
  cancel: async (rentalId) => {
    const response = await api.delete(`/rental/${rentalId}`);
    return response.data;
  },
};
```

### React Component Examples

#### Login Component

```jsx
// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token, role } = await login(username, password);
      console.log("Logged in as:", role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
```

#### Equipment List Component

```jsx
// src/components/EquipmentList.jsx
import React, { useState, useEffect } from "react";
import { equipmentService } from "../services/equipmentService";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const data = await equipmentService.getAvailable();
      setEquipment(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Available Equipment</h2>
      <div className="equipment-grid">
        {equipment.map((item) => (
          <div key={item.id} className="equipment-card">
            <h3>{item.name}</h3>
            <p>Category: {item.category}</p>
            <p>Daily Rate: ${item.dailyRentalRate}</p>
            <p>Status: {item.isAvailable ? "Available" : "Rented"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
```

---

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

## Enum Values

### Status (Rental Status)

- `Active` - Rental is currently active
- `Completed` - Rental has been returned

### Role (User Role)

- `Admin` - Administrator with full access
- `User` - Regular user with limited access

### Condition

- `Excellent` - Equipment in excellent condition
- `Good` - Equipment in good condition
- `Fair` - Equipment in fair condition
- `Poor` - Equipment in poor condition

---

## Testing CORS

### Using Browser Console

```javascript
// Test CORS from browser console
fetch("http://localhost:5000/api/equipment", {
  headers: {
    Authorization: "Bearer YOUR_TOKEN_HERE",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

### Using curl

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:5000/api/equipment \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl -X GET http://localhost:5000/api/equipment \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -v
```

---

## Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend is running on a port not allowed by CORS policy.

**Solution:** The current configuration allows all localhost ports, so this shouldn't occur. If it does, verify:

1. Your React app is running on localhost
2. The backend is running and accessible
3. The CORS middleware is properly configured in `Program.cs`

### 401 Unauthorized

**Cause:** Missing or invalid JWT token.

**Solution:**

1. Ensure you're logged in
2. Check that the token is stored correctly
3. Verify the Authorization header is being sent: `Bearer YOUR_TOKEN`

### 403 Forbidden

**Cause:** User doesn't have required role for the endpoint.

**Solution:**

1. Check if the endpoint requires Admin role
2. Verify user's role in the token
3. Use an Admin account for Admin-only endpoints

### JSON Property Names Don't Match

**Cause:** Expecting camelCase but getting PascalCase (or vice versa).

**Solution:** The backend is configured to automatically convert to camelCase. Ensure you're using the updated `Program.cs` configuration.

---

## Production Considerations

When deploying to production:

1. **Update CORS Origins:** Replace the localhost check with your actual production domain:

```csharp
// In Program.cs
policy.WithOrigins(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
)
```

2. **Disable Pretty Printing:** For smaller payloads:

```csharp
options.JsonSerializerOptions.WriteIndented = false;
```

3. **Use HTTPS:** Ensure both frontend and backend use HTTPS in production.

4. **Secure JWT Secret:** Use a strong, environment-specific secret key.

5. **Configure Token Expiration:** Adjust token lifetime based on your security requirements.

---

## Additional Resources

- [ASP.NET Core CORS Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/cors)
- [JWT Authentication in React](https://jwt.io/introduction)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Router Documentation](https://reactrouter.com/)

---

## Questions or Issues?

If you encounter any issues with the CORS configuration or React integration, check:

1. Browser console for CORS errors
2. Network tab for request/response headers
3. Backend logs for authentication errors
4. This documentation for correct API usage
