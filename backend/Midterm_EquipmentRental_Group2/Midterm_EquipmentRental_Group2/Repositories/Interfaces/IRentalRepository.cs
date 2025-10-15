using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface IRentalRepository
    {
        IEnumerable<Rental> GetAllRentals();
        Rental GetRentalById(int id);
        void AddRental(Rental rental);
        void UpdateRental(Rental rental);
        void DeleteRental(int id);
        IEnumerable<Rental> GetActiveRentals();
        IEnumerable<Rental> GetCompletedRentals();
        IEnumerable<Rental> GetOverdueRentals();
        IEnumerable<Rental> GetRentalByEquipment(int equipmentId);
        IEnumerable<Rental> GetRentalByCustomer(int customerId); 
    }
}
