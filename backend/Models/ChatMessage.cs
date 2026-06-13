using System.ComponentModel.DataAnnotations;

namespace Midterm_EquipmentRental_Group2.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        [Required]
        public string UserEmail { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        [Required]
        public string Text { get; set; } = string.Empty;

        public DateTime SentAtUtc { get; set; } = DateTime.UtcNow;

        // Link to a specific rental
        public int RentalId { get; set; }
        public Rental? Rental { get; set; }
    }
}