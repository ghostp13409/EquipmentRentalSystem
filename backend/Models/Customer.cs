using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.ComponentModel.DataAnnotations;

namespace Midterm_EquipmentRental_Group2.Models
{
    public class Customer
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Please Enter Name.")]
        public string Name { get; set; }
        [EmailAddress(ErrorMessage = "Please Enter Valid Email Address.")]
        public string? Email { get; set; }

        // Make Username nullable for OAuth users (they don't need username)
        public string? Username { get; set; }

        // Make Password nullable for OAuth users (they authenticate via Google)
        public string? Password { get; set; }

        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ADD: OAuth properties
        public string? ExternalProvider { get; set; } // "Google" or null
        public string? ExternalId { get; set; } // Google's sub claim (user ID from Google)
    }
}
