using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;

namespace Midterm_EquipmentRental_Group2.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;
        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Customer> GetAllCustomers()
        {
            return _context.Customers.ToList();
        }

        public Customer GetCustomerById(int id)
        {
            return _context.Customers.Find(id);
        }

        public void AddCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
        }

        public void UpdateCustomer(Customer customer)
        {
            _context.Customers.Update(customer);
        }

        public void DeleteCustomer(int id)
        {
            _context.Customers.Remove(GetCustomerById(id));
        }

        public Customer GetCustomerByUsername(string username)
        {
            return _context.Customers.FirstOrDefault(c => c.Username == username);
        }

        public IEnumerable<Rental> GetRentalsByCustomer(int customerId)
        {
            return _context.Rentals.Where(r => r.CustomerId == customerId).ToList();
        }

        public Rental GetActiveRentalByCustomer(int customerId)
        {
            return _context.Rentals.FirstOrDefault(r => r.CustomerId == customerId && r.ReturnedAt == null);
        }

        public bool HasActiveRental(int customerId)
        {
            return _context.Rentals.Any(r => r.CustomerId == customerId && r.ReturnedAt == null);
        }
    }
}
