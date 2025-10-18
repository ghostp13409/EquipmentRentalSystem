using Microsoft.EntityFrameworkCore;
using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Repositories;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;
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
        // Allow all localhost origins (any port) for development
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;

            // Allow localhost and 127.0.0.1 with any port
            if (origin.StartsWith("http://localhost:", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("https://localhost:", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("http://127.0.0.1:", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("https://127.0.0.1:", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        })
        .AllowAnyMethod()  // Allow GET, POST, PUT, DELETE, OPTIONS, etc.
        .AllowAnyHeader()  // Allow all headers including Authorization
        .AllowCredentials()  // Allow cookies and credentials for JWT
        .WithExposedHeaders("Content-Disposition", "X-Pagination"); // Expose custom headers if needed
    });
});



// Add Jwt Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("YourSecretKeyHere1234567890Something")),
            ClockSkew = TimeSpan.Zero
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

// Configure JSON serialization for JavaScript/React compatibility
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use camelCase for JSON properties (JavaScript convention)
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;

        // Convert enums to strings instead of numbers
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

        // Ignore null values in responses (optional - keeps responses cleaner)
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;

        // Handle reference loops (if you have circular references in your models)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

        // Make JSON more readable (optional - disable in production for smaller payloads)
        options.JsonSerializerOptions.WriteIndented = true;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();

    // Seed admin user if not exists
    if (!dbContext.Customers.Any(c => c.Username == "admin"))
    {
        dbContext.Customers.Add(new Midterm_EquipmentRental_Group2.Models.Customer
        {
            Name = "Admin User",
            Username = "admin",
            Password = "admin123", // In production, hash passwords
            Email = "admin@example.com",
            Role = Midterm_EquipmentRental_Group2.Models.Role.Admin
        });
        dbContext.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANT: CORS must be configured before Authentication and Authorization
app.UseCors("ReactAppPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
