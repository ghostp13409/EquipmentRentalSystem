using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        IEnumerable<Customer> GetAllCustomers();
        Customer GetCustomerById(int id);
        void AddCustomer(Customer customer);
        void UpdateCustomer(Customer customer);
        void DeleteCustomer(int id);
        Customer GetCustomerByUsername(string username);
        IEnumerable<Rental> GetRentalsByCustomer(int customerId);
        Rental GetActiveRentalByCustomer(int customerId);
        bool HasActiveRental(int customerId);
    }
}
