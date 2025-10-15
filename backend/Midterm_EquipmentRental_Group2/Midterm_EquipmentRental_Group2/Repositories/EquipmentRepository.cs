using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;

namespace Midterm_EquipmentRental_Group2.Repositories
{
	public class EquipmentRepository : IEquipmentRepository
    {
        private readonly AppDbContext _context;


        public EquipmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Equipment> GetAllEquipment()
        {
            return _context.Equipments.ToList();
        }

        public Equipment GetEquipmentById(int id)
        {
            return _context.Equipments.Find(id);
        }

        public void AddEquipment(Equipment equipment)
        {
            _context.Equipments.Add(equipment);
        }


        public void DeleteEquipment(int id)
        {
            var equipment = _context.Equipments.Find(id);
            if (equipment != null)
            {
                _context.Equipments.Remove(equipment);
            }

        }

        public void UpdateEquipment(Equipment equipment)
        {
            _context.Equipments.Update(equipment);
        }

        public IEnumerable<Equipment> GetAvailableEquipment()
        {
            return _context.Equipments.Where(e => e.IsAvailable).ToList();
        }

        public IEnumerable<Equipment> GetRentedEquipment()
        {
            return _context.Equipments.Where(e => !e.IsAvailable).ToList();
        }
    }
}
