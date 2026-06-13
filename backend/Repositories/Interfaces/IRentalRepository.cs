using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface IRentalRepository : IRepository<Rental>
    {
        IEnumerable<Rental> GetActiveRentals();
        IEnumerable<Rental> GetCompletedRentals();
        IEnumerable<Rental> GetOverdueRentals();
        IEnumerable<Rental> GetRentalByEquipment(int equipmentId);
        IEnumerable<Rental> GetRentalsByCustomer(int customerId);
        bool HasActiveRental(int customerId);
    }
}
