using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;

namespace Midterm_EquipmentRental_Group2.Repositories
{
    public class RentalRepository : IRentalRepository
    {
        private readonly AppDbContext _context;

        public RentalRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Rental> GetAllRentals()
        {
            return _context.Rentals.ToList();
        }

        public IEnumerable<Rental> GetRentalsByCustomer(int customerId)
        {
            return _context.Rentals.Where(r => r.CustomerId == customerId).ToList();
        }

        public Rental? GetRentalById(int id)
        {
            return _context.Rentals.Find(id);
        }
        public void AddRental(Rental rental)
        {
            _context.Rentals.Add(rental);
        }
        public void DeleteRental(int id)
        {
            var rental = _context.Rentals.Find(id);
            if (rental != null)
            {
                _context.Rentals.Remove(rental);
            }
        }
        public void UpdateRental(Rental rental)
        {
            _context.Rentals.Update(rental);
        }

        public IEnumerable<Rental> GetActiveRentals()
        {
            return _context.Rentals.Where(r => r.ReturnedAt == null).ToList();
        }

        public IEnumerable<Rental> GetCompletedRentals()
        {
            return _context.Rentals.Where(r => r.ReturnedAt != null).ToList();
        }

        public IEnumerable<Rental> GetOverdueRentals()
        {
            return _context.Rentals.Where(r => r.DueDate < DateTime.Now && r.ReturnedAt == null).ToList();
        }

        public IEnumerable<Rental> GetRentalByEquipment(int equipmentId)
        {
            return _context.Rentals.Where(r => r.EquipmentId == equipmentId).ToList();
        }

        public IEnumerable<Rental> GetRentalByCustomer(int customerId)
        {
            return _context.Rentals.Where(r => r.CustomerId == customerId).ToList();
        }
    }
}
