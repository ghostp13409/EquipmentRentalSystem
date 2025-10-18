using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<Customer> GetAll()
        {
            return _context.Customers.ToList();
        }

        public Customer GetById(int id)
        {
            return _context.Customers.Find(id);
        }

        public void Add(Customer customer)
        {
            _context.Customers.Add(customer);
        }

        public void Update(Customer customer)
        {
            _context.Customers.Update(customer);
        }

        public void Delete(int id)
        {
            _context.Customers.Remove(GetById(id));
        }

        public Customer GetCustomerByUsername(string username)
        {
            return _context.Customers.FirstOrDefault(c => c.Username == username);
        }

        public Rental GetActiveRentalByCustomer(int customerId)
        {
            return _context.Rentals
                .Include(r => r.Equipment)
                .Include(r => r.Customer)
                .FirstOrDefault(r => r.CustomerId == customerId && r.ReturnedAt == null);
        }
    }
}
