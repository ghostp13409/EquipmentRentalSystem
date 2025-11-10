namespace Midterm_EquipmentRental_Group2.Models
{
    public class AppUser
    {
        public int Id { get; set; }
        public string Email { get; set; } = default!;
        public string Role { get; set; } = "User"; // "Admin" or "User"
        public string? ExternalProvider { get; set; } = "Google";
        public string? ExternalId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
