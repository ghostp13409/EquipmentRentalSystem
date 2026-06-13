using System.ComponentModel.DataAnnotations;

namespace Midterm_EquipmentRental_Group2.DTOs
{
    public class UpdateCustomerDto
    {
        [Required(ErrorMessage = "Please Enter Name.")]
        [MinLength(1, ErrorMessage = "Name cannot be empty.")]
        public string Name { get; set; }
        public string Email { get; set; }
        [Required(ErrorMessage = "Username is Required.")]
        [MinLength(1, ErrorMessage = "Username cannot be empty.")]
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}