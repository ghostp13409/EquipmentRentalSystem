using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface IEquipmentRepository : IRepository<Equipment>
    {
        IEnumerable<Equipment> GetAvailableEquipment();

        IEnumerable<Equipment> GetRentedEquipment();
    }
}
