using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Repositories;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;
using Midterm_EquipmentRental_Group2.Services;
using Midterm_EquipmentRental_Group2.UnitOfWork;
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

// FrontEnd Url
var frontendUrl = "http://localhost:3000";

// Configure Google OAuth Authentication
builder.Services.AddHttpClient<ApiClient>(c =>
{
    // Points to API; configurable in appsettings
    c.BaseAddress = new Uri(builder.Configuration["Api:BaseAddress"]!);
});

// JWT minting service (creates short-lived JWTs that include the user's role claims)
builder.Services.AddScoped<JwtService>();

// Google login issues an auth cookie for the UI; UI then mints its own JWT when calling the API
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;   // use cookie for UI session
    opt.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;        // challenge via Google
})
.AddCookie(o =>
{
    o.LoginPath = "/auth/login";
    o.LogoutPath = "/auth/logout";
    o.AccessDeniedPath = "/auth/denied";
})
.AddGoogle(o =>
{
    // Register a Web application OAuth client in Google Cloud Console,
    // and set the Authorized redirect URI to: https://localhost:{UI_PORT}/signin-google
    o.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    o.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;

    // Add email and profile to scope
    o.Scope.Add("email");
    o.Scope.Add("profile");
    o.Events.OnTicketReceived = context =>
    {
        // Redirect to frontend OAuth callback page
        context.ReturnUri = $"{frontendUrl}/oauth/callback";
        return Task.CompletedTask;
    };
});

// This transformer runs AFTER Google login, BEFORE authorization,
// and adds ClaimTypes.Role ("Admin" or "User") based on email list in appsettings.
builder.Services.AddScoped<IClaimsTransformation, RoleClaimsTransformer>();

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
