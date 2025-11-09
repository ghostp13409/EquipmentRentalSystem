# Assignment 3 — Google OAuth Authentication and Role-Based Authorization

Course: Enterprise Application Development

Total Marks: 10

Type: Individual or Same Midterm Group

Submission Format: Zipped solution folder or GitHub link + demo video

## 🎯 Objective

Enhance your Midterm Equipment Rental Management System by replacing your existing JWT authentication with Google OAuth (OpenID Connect). The app must still enforce role-based authorization using claims so that:

- Admins access the Admin Dashboard and management endpoints.
- Users access the User Dashboard and their own data only.

## ⚙️ Requirements (Implementation + Demo = 10 Marks)

1. 🔐 1. Authentication Setup (3 Marks)

- Remove/disable existing JWT authentication.Add Google OpenID Connect in Program.cs using Cookie + OIDC schemes.Configure ClientId, ClientSecret, and CallbackPath = /signin-oidc.Required scopes: openid, profile, email.After Google login, extract email and sub claims.

1. 👥 2. Local User Store + Claims Mapping (3 Marks)

Create an AppUser model and add it to your AppDbContext:

```csharp
public class AppUser {
		public int Id { get; set; }
		public string Email { get; set; } = default!;
		public string Role { get; set; } = "User"; // "Admin" or "User"
		public string? ExternalProvider { get; set; } = "Google";
		public string? ExternalId { get; set; }
}
```

- Seed at least one Admin user (email-based).
- On OnTokenValidated, lookup/create AppUser and attach Role claim.
- Use [Authorize] and [Authorize(Roles="Admin")] to protect controllers.

1. 🧭 3. UI Integration + Role Redirect (2 Marks)

- Replace the login page with a “Sign in with Google” button.On successful sign-in, redirect: – Admin → Admin Dashboard – User → User Dashboard
- Add a “Logout” button that clears the authentication cookie.

Google OAuth Config for appsettings.json:

```json
"Authentication": {
  "Google": {
    "ClientId": "981148048304-58ih8a6n4cf0stbsibgcrmoo37sab8oc.apps.googleusercontent.com",
    "ClientSecret": "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"
  }
},
"AuthDemo": {
  // This email list decides who is Admin; everyone else becomes "User".
  "AdminEmails": [ "gajjarparth09@gmail.com" ]
},
"Api": {
  // Base address of the API project (adjust the port to your API's HTTPS port).
  "BaseAddress": "https://localhost:7223/"
},
// ---- shared JWT config (must match API) ----
"Jwt": {
  "Issuer": "Server",
  "Audience": "Client",
  "SigningKey": "put_anything_here_that_is_at_least_64_characters_to_make_it_secure_123456"
}
```
