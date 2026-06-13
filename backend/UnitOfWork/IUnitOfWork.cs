using Midterm_EquipmentRental_Group2.Repositories.Interfaces;

namespace Midterm_EquipmentRental_Group2.UnitOfWork
{
    public interface IUnitOfWork
    {
        IEquipmentRepository Equipments { get; }
        ICustomerRepository Customers { get; }
        IRentalRepository Rentals { get; }
        IChatMessageRepository ChatMessages { get; }
        void Save();
    }
}
