using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface ICustomerRepository: IRepository<Customer>
    {
        Customer GetCustomerByUsername(string username);
        Rental GetActiveRentalByCustomer(int customerId);
    }
}
