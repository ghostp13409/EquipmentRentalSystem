namespace Midterm_EquipmentRental_Group2.Models
{
    public enum Category
       {
           HeavyMachinery,
           PowerTools,
           Vehicles,
           Safety,
           Surveying
       }

       public enum Condition
       {
           New,
           Excellent,
           Good,
           Fair,
           Poor
       }

       public enum Role
       {
           Admin,
           User
       }
       public enum Status
       {
           Active,
           Completed,
           Overdue
       }
}
