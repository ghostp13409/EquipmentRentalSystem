using System.ComponentModel.DataAnnotations;

namespace Midterm_EquipmentRental_Group2.DTOs
{
    public class IssueRentalRequest
    {
        [Required]
        public int EquipmentId { get; set; }
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public string DueDate { get; set; }
    }
}