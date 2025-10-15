using Microsoft.EntityFrameworkCore;
using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Rental> Rentals { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed Admin
            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "Admin", Email = "admin@example.com", Username = "admin", Password = "admin", Role = Role.Admin }
            );

            // Seed Users
            var users = new[]
            {
                new Customer { Id = 2, Name = "John Doe", Email = "john@example.com", Username = "johndoe", Password = "user", Role = Role.User },
                new Customer { Id = 3, Name = "Jane Smith", Email = "jane@example.com", Username = "janesmith", Password = "user", Role = Role.User },
                new Customer { Id = 4, Name = "Bob Johnson", Email = "bob@example.com", Username = "bobjohnson", Password = "user", Role = Role.User },
                new Customer { Id = 5, Name = "Alice Brown", Email = "alice@example.com", Username = "alicebrown", Password = "user", Role = Role.User },
                new Customer { Id = 6, Name = "Charlie Wilson", Email = "charlie@example.com", Username = "charliewilson", Password = "user", Role = Role.User }
            };
            modelBuilder.Entity<Customer>().HasData(users);

            // Seed Equipment
            modelBuilder.Entity<Equipment>().HasData(
                new Equipment { Id = 1, Name = "Excavator", Description = "Heavy-duty digging machine", Category = Category.HeavyMachinery, Condition = Condition.Good, RentalPrice = 150.00m, IsAvailable = true },
                new Equipment { Id = 2, Name = "Power Drill", Description = "Cordless drill for construction", Category = Category.PowerTools, Condition = Condition.Excellent, RentalPrice = 25.00m, IsAvailable = true },
                new Equipment { Id = 3, Name = "Dump Truck", Description = "Large vehicle for hauling", Category = Category.Vehicles, Condition = Condition.Fair, RentalPrice = 200.00m, IsAvailable = false },
                new Equipment { Id = 4, Name = "Safety Helmet", Description = "Protective headgear", Category = Category.Safety, Condition = Condition.New, RentalPrice = 10.00m, IsAvailable = true },
                new Equipment { Id = 5, Name = "Surveying Tool", Description = "Precision measuring device", Category = Category.Surveying, Condition = Condition.Poor, RentalPrice = 50.00m, IsAvailable = true }
            );

            // Seed Rentals
            modelBuilder.Entity<Rental>().HasData(
                new Rental { Id = 1, EquipmentId = 3, CustomerId = 2, IssuedAt = DateTime.UtcNow.AddDays(-2), DueDate = DateTime.UtcNow.AddDays(5), ReturnedAt = null, Notes = "Active rental" },
                new Rental { Id = 2, EquipmentId = 1, CustomerId = 3, IssuedAt = DateTime.UtcNow.AddDays(-10), DueDate = DateTime.UtcNow.AddDays(-3), ReturnedAt = DateTime.UtcNow.AddDays(-1), ConditionOnReturn = Condition.Good, Notes = "Returned in good condition" }
            );
        }
    }
}
