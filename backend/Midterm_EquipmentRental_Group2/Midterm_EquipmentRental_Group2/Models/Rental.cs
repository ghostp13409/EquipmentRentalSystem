using System.ComponentModel.DataAnnotations;

namespace Midterm_EquipmentRental_Group2.Models
{

	public class Rental
	{
        public int Id { get; set; }

        // Foreign Keys
        public int EquipmentId { get; set; }
        [Required]
        public Equipment? Equipment { get; set; }
        public int CustomerId { get; set; }
        [Required]
        public Customer? Customer { get; set; }

        [Required]
        public DateTime IssuedAt { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? ReturnedAt { get; set; }

        public Condition ConditionOnReturn { get; set; }
        public string Notes { get; set; }
        public Status Status => ReturnedAt.HasValue ? Status.Completed :
               (DueDate < DateTime.UtcNow ? Status.Overdue : Status.Active);
    }
}
