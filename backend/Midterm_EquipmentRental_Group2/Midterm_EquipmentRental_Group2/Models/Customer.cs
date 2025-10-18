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
        [Required(ErrorMessage = "Username is Requierd.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Password is Requierd."), DataType(DataType.Password), MinLength(6, ErrorMessage = "Password must be at least 6 characters long."), MaxLength(100, ErrorMessage = "Password must be at most 100 characters long.")]
        public string Password { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
