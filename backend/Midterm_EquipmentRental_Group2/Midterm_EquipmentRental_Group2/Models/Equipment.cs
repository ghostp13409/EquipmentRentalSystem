using System.ComponentModel.DataAnnotations;

namespace Midterm_EquipmentRental_Group2.Models
{
	public class Equipment
	{
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, MaxLength(500)]
        public string Description { get; set; }
        [Required]
        public Category Category { get; set; }
        public Condition Condition { get; set; } = Condition.New;
        public decimal RentalPrice { get; set; }
        public bool IsAvailable { get; set; } = true;
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        }
}
