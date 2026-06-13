namespace Midterm_EquipmentRental_Group2.DTOs
{
    public class ReturnRentalRequest
    {
        public int RentalId { get; set; }
        public string ConditionOnReturn { get; set; }
        public string? Notes { get; set; }
    }
}