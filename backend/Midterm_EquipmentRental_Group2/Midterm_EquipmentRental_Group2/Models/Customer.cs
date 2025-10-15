using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Midterm_EquipmentRental_Group2.Models
{
	public class Customer
	{
		public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
