namespace Midterm_EquipmentRental_Group2.Models
{
	public class Equipment
	{
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Category Category { get; set; }
        public Condition Condition { get; set; }
        public decimal RentalPrice { get; set; }
        public bool IsAvailable { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
