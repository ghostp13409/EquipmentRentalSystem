using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface IEquipmentRepository
    {
        IEnumerable<Equipment> GetAllEquipment();

        Equipment GetEquipmentById(int id);

        void AddEquipment(Equipment equipment);

        void UpdateEquipment(Equipment equipment);

        void DeleteEquipment(int id);

        IEnumerable<Equipment> GetAvailableEquipment();

        IEnumerable<Equipment> GetRentedEquipment();
    }
}
