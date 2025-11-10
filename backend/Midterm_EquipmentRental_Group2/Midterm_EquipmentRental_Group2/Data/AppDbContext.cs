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
                new Customer { Id = 6, Name = "Charlie Wilson", Email = "charlie@example.com", Username = "charliewilson", Password = "user", Role = Role.User },
                new Customer { Id = 7, Name = "David Lee", Email = "david@example.com", Username = "davidlee", Password = "user", Role = Role.User },
                new Customer { Id = 8, Name = "Emma Davis", Email = "emma@example.com", Username = "emmadavis", Password = "user", Role = Role.User },
                new Customer { Id = 9, Name = "Frank Miller", Email = "frank@example.com", Username = "frankmiller", Password = "user", Role = Role.User },
                new Customer { Id = 10, Name = "Grace Garcia", Email = "grace@example.com", Username = "gracegarcia", Password = "user", Role = Role.User },
                new Customer { Id = 11, Name = "Henry Taylor", Email = "henry@example.com", Username = "henrytaylor", Password = "user", Role = Role.User }
            };
            modelBuilder.Entity<Customer>().HasData(users);

            // Seed Equipment
            var equipments = new[]
            {
                new Equipment { Id = 1, Name = "Excavator", Description = "Heavy-duty digging machine", Category = Category.HeavyMachinery, Condition = Condition.Good, RentalPrice = 150.00m, IsAvailable = true },
                new Equipment { Id = 2, Name = "Power Drill", Description = "Cordless drill for construction", Category = Category.PowerTools, Condition = Condition.Excellent, RentalPrice = 25.00m, IsAvailable = true },
                new Equipment { Id = 3, Name = "Dump Truck", Description = "Large vehicle for hauling", Category = Category.Vehicles, Condition = Condition.Fair, RentalPrice = 200.00m, IsAvailable = false },
                new Equipment { Id = 4, Name = "Safety Helmet", Description = "Protective headgear", Category = Category.Safety, Condition = Condition.New, RentalPrice = 10.00m, IsAvailable = true },
                new Equipment { Id = 5, Name = "Surveying Tool", Description = "Precision measuring device", Category = Category.Surveying, Condition = Condition.Poor, RentalPrice = 50.00m, IsAvailable = true },
                new Equipment { Id = 6, Name = "Bulldozer", Description = "Heavy earth-moving equipment", Category = Category.HeavyMachinery, Condition = Condition.Excellent, RentalPrice = 250.00m, IsAvailable = true },
                new Equipment { Id = 7, Name = "Circular Saw", Description = "Electric saw for cutting wood", Category = Category.PowerTools, Condition = Condition.Good, RentalPrice = 30.00m, IsAvailable = false },
                new Equipment { Id = 8, Name = "Forklift", Description = "Industrial lifting vehicle", Category = Category.Vehicles, Condition = Condition.Fair, RentalPrice = 120.00m, IsAvailable = true },
                new Equipment { Id = 9, Name = "Hard Hat", Description = "Safety head protection", Category = Category.Safety, Condition = Condition.New, RentalPrice = 8.00m, IsAvailable = true },
                new Equipment { Id = 10, Name = "Theodolite", Description = "Surveying instrument", Category = Category.Surveying, Condition = Condition.Good, RentalPrice = 75.00m, IsAvailable = false },
                new Equipment { Id = 11, Name = "Crane", Description = "Heavy lifting machinery", Category = Category.HeavyMachinery, Condition = Condition.Poor, RentalPrice = 300.00m, IsAvailable = true },
                new Equipment { Id = 12, Name = "Angle Grinder", Description = "Power tool for grinding", Category = Category.PowerTools, Condition = Condition.Fair, RentalPrice = 20.00m, IsAvailable = true },
                new Equipment { Id = 13, Name = "Pickup Truck", Description = "Utility vehicle", Category = Category.Vehicles, Condition = Condition.Good, RentalPrice = 80.00m, IsAvailable = false },
                new Equipment { Id = 14, Name = "Safety Gloves", Description = "Protective hand wear", Category = Category.Safety, Condition = Condition.Excellent, RentalPrice = 5.00m, IsAvailable = true },
                new Equipment { Id = 15, Name = "GPS Surveying Unit", Description = "Modern surveying device", Category = Category.Surveying, Condition = Condition.New, RentalPrice = 100.00m, IsAvailable = true }
            };
            modelBuilder.Entity<Equipment>().HasData(equipments);

            // Seed Rentals
            var rentals = new[]
            {
                // Active rentals (not returned, due in future)
                new Rental { Id = 1, EquipmentId = 3, CustomerId = 2, IssuedAt = DateTime.UtcNow.AddDays(-2), DueDate = DateTime.UtcNow.AddDays(5), ReturnedAt = null, Status = Status.Active, Notes = "Active rental" },
                new Rental { Id = 2, EquipmentId = 7, CustomerId = 4, IssuedAt = DateTime.UtcNow.AddDays(-1), DueDate = DateTime.UtcNow.AddDays(7), ReturnedAt = null, Status = Status.Active, Notes = "Active rental" },
                new Rental { Id = 3, EquipmentId = 10, CustomerId = 6, IssuedAt = DateTime.UtcNow.AddDays(-3), DueDate = DateTime.UtcNow.AddDays(4), ReturnedAt = null, Status = Status.Active, Notes = "Active rental" },
                new Rental { Id = 4, EquipmentId = 13, CustomerId = 8, IssuedAt = DateTime.UtcNow.AddDays(-5), DueDate = DateTime.UtcNow.AddDays(10), ReturnedAt = null, Status = Status.Active, Notes = "Active rental" },

                // Completed rentals (returned)
                new Rental { Id = 5, EquipmentId = 1, CustomerId = 3, IssuedAt = DateTime.UtcNow.AddDays(-10), DueDate = DateTime.UtcNow.AddDays(-3), ReturnedAt = DateTime.UtcNow.AddDays(-1), ConditionOnReturn = Condition.Good, Status = Status.Completed, Notes = "Returned in good condition" },
                new Rental { Id = 6, EquipmentId = 2, CustomerId = 5, IssuedAt = DateTime.UtcNow.AddDays(-15), DueDate = DateTime.UtcNow.AddDays(-8), ReturnedAt = DateTime.UtcNow.AddDays(-7), ConditionOnReturn = Condition.Excellent, Status = Status.Completed, Notes = "Returned in excellent condition" },
                new Rental { Id = 7, EquipmentId = 6, CustomerId = 7, IssuedAt = DateTime.UtcNow.AddDays(-20), DueDate = DateTime.UtcNow.AddDays(-12), ReturnedAt = DateTime.UtcNow.AddDays(-11), ConditionOnReturn = Condition.Fair, Status = Status.Completed, Notes = "Returned with some wear" },
                new Rental { Id = 8, EquipmentId = 9, CustomerId = 9, IssuedAt = DateTime.UtcNow.AddDays(-25), DueDate = DateTime.UtcNow.AddDays(-18), ReturnedAt = DateTime.UtcNow.AddDays(-16), ConditionOnReturn = Condition.Poor, Status = Status.Completed, Notes = "Returned damaged" },

                // Overdue rentals (past due, not returned)
                new Rental { Id = 9, EquipmentId = 11, CustomerId = 10, IssuedAt = DateTime.UtcNow.AddDays(-10), DueDate = DateTime.UtcNow.AddDays(-2), ReturnedAt = null, Status = Status.Active, Notes = "Overdue rental" },
                new Rental { Id = 10, EquipmentId = 14, CustomerId = 11, IssuedAt = DateTime.UtcNow.AddDays(-7), DueDate = DateTime.UtcNow.AddDays(-1), ReturnedAt = null, Status = Status.Active, Notes = "Overdue rental" }
            };
            modelBuilder.Entity<Rental>().HasData(rentals);
        }
    }
}
