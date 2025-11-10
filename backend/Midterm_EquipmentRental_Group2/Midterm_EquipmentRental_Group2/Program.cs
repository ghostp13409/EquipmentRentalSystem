using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.Repositories;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;
using Midterm_EquipmentRental_Group2.UnitOfWork;
using System.Security.Claims;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("MidtermProjectGoup2Db"));

// Configure CORS for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;

            if (origin.StartsWith("http://localhost:", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("https://localhost:", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("http://127.0.0.1:", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("https://127.0.0.1:", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        })
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials() 
        .WithExposedHeaders("Content-Disposition", "X-Pagination");
    });
});

// Get config values
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
var adminEmails = builder.Configuration.GetSection("AuthDemo:AdminEmails").Get<string[]>() ?? Array.Empty<string>();
var frontendUrl = "http://localhost:3000";

// Configure Google OAuth Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.Cookie.Name = "EquipmentRental.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
})
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = googleClientId ?? throw new InvalidOperationException("Google ClientId is not configured");
    options.ClientSecret = googleClientSecret ?? throw new InvalidOperationException("Google ClientSecret is not configured");
    options.CallbackPath = "/signin-oidc";
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.Events.OnCreatingTicket = async context =>
    {
        var email = context.Principal?.FindFirst(ClaimTypes.Email)?.Value
            ?? context.Principal?.FindFirst("email")?.Value;
        var sub = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? context.Principal?.FindFirst("sub")?.Value;
        var name = context.Principal?.FindFirst(ClaimTypes.Name)?.Value
            ?? context.Principal?.FindFirst("name")?.Value;

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(sub))
        {
            context.Fail("Email or Sub claim not found");
            return;
        }

        
        using var scope = context.HttpContext.RequestServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Find or create Customer by email or ExternalId
        var customer = await dbContext.Customers
            .FirstOrDefaultAsync(c => c.Email == email || c.ExternalId == sub);

        if (customer == null)
        {
            // Determine role based on admin emails list
            var role = adminEmails.Contains(email, StringComparer.OrdinalIgnoreCase)
                ? Midterm_EquipmentRental_Group2.Models.Role.Admin
                : Midterm_EquipmentRental_Group2.Models.Role.User;

            // Create new Customer for Google OAuth user
            customer = new Customer
            {
                Email = email,
                Name = name ?? email.Split('@')[0],
                Username = null,
                Password = null,
                Role = role,
                ExternalProvider = "Google",
                ExternalId = sub,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.Customers.Add(customer);
            await dbContext.SaveChangesAsync();
        }
        else
        {
            // TODO: Remove all of the old customers and data related to them
            // Update existing customer
            if (adminEmails.Contains(email, StringComparer.OrdinalIgnoreCase))
            {
                customer.Role = Role.Admin;
            }

            // Update ExternalId if missing (for existing customers logging in with Google)
            if (string.IsNullOrEmpty(customer.ExternalId))
            {
                customer.ExternalId = sub;
                customer.ExternalProvider = "Google";
            }

            // Update name if missing or changed
            if (string.IsNullOrEmpty(customer.Name) && !string.IsNullOrEmpty(name))
            {
                customer.Name = name;
            }

            // Update email if changed
            if (customer.Email != email)
            {
                customer.Email = email;
            }

            await dbContext.SaveChangesAsync();
        }

        // Add role claim to the principal
        var claimsIdentity = context.Principal?.Identity as ClaimsIdentity;
        if (claimsIdentity != null)
        {
            // Remove existing role claims
            var existingRoleClaims = claimsIdentity.FindAll(ClaimTypes.Role).ToList();
            foreach (var claim in existingRoleClaims)
            {
                claimsIdentity.RemoveClaim(claim);
            }

            // Add new role claim (convert Role enum to string)
            claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, customer.Role.ToString()));

            // IMPORTANT: Add UserId claim with Customer.Id (this is what controllers expect)
            claimsIdentity.AddClaim(new Claim("UserId", customer.Id.ToString()));

            // Keep NameIdentifier for reference (Google's sub)
            if (!claimsIdentity.HasClaim(c => c.Type == ClaimTypes.NameIdentifier))
            {
                claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, customer.ExternalId ?? customer.Id.ToString()));
            }

            // Ensure email claim exists
            if (!claimsIdentity.HasClaim(c => c.Type == ClaimTypes.Email))
            {
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Email, customer.Email ?? email));
            }

            // Add name claim
            if (!claimsIdentity.HasClaim(c => c.Type == ClaimTypes.Name))
            {
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Name, customer.Name));
            }
        }
    };

    // IMPORTANT: Redirect to frontend callback after successful authentication
    options.Events.OnTicketReceived = context =>
    {
        // Redirect to frontend OAuth callback page
        context.ReturnUri = $"{frontendUrl}/oauth/callback";
        return Task.CompletedTask;
    };
});

// Add Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserPolicy", policy => policy.RequireRole("User", "Admin"));
});

// Add Repositories and Unit of Work
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IEquipmentRepository, EquipmentRepository>();
builder.Services.AddScoped<IRentalRepository, RentalRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Configure JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add CORS Policy
app.UseCors("ReactAppPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
