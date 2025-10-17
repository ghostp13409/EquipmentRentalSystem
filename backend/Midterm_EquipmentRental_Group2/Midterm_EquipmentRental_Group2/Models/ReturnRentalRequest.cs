namespace Midterm_EquipmentRental_Group2.Models
{
    public class ReturnRentalRequest
    {
        public int RentalId { get; set; }
        public Condition ConditionOnReturn { get; set; }
        public string Notes { get; set; }
    }
}
