using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;

namespace Midterm_EquipmentRental_Group2.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public ICustomerRepository Customers { get; private set; }
        public IEquipmentRepository Equipments { get; private set; }
        public IRentalRepository Rentals { get; private set; }

        public UnitOfWork(AppDbContext context, ICustomerRepository customerRepository, IEquipmentRepository equipmentRepository, IRentalRepository rentalRepository)
        {
            _context = context;
            Customers = customerRepository;
            Equipments = equipmentRepository;
            Rentals = rentalRepository;
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
