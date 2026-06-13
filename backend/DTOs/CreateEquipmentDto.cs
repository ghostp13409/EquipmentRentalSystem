using System.ComponentModel.DataAnnotations;
using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.DTOs
{
    public class CreateEquipmentDto
    {
        [Required]
        public string Name { get; set; }
        [Required, MaxLength(500)]
        public string Description { get; set; }
        [Required]
        public Category Category { get; set; }
        public Condition Condition { get; set; } = Condition.New;
        public decimal RentalPrice { get; set; }
    }
}