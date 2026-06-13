using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.Repositories.Interfaces;

namespace Midterm_EquipmentRental_Group2.Repositories
{
    public class ChatMessageRepository : IChatMessageRepository
    {
        private readonly AppDbContext _context;
        public ChatMessageRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<ChatMessage> GetMessagesByRentalId(int rentalId)
        {
            return _context.ChatMessages
                .Where(m => m.RentalId == rentalId)
                .OrderBy(m => m.SentAtUtc)
                .ToList();
        }

        public void DeleteOlderThan(DateTime cutoff)
        {
            var oldMessages = _context.ChatMessages.Where(m => m.SentAtUtc < cutoff);
            _context.ChatMessages.RemoveRange(oldMessages);
        }

        public IEnumerable<ChatMessage> GetAll()
        {
            return _context.ChatMessages.ToList();
        }
        public ChatMessage GetById(int id)
        {
            return _context.ChatMessages.Find(id);
        }
        public ChatMessage GetById(string id) {
                        throw new NotImplementedException();
        }
        public void Add(ChatMessage entity)
        {
            _context.ChatMessages.Add(entity);
        }
        public void Update(ChatMessage entity)
        {
            _context.ChatMessages.Update(entity);
        }

        public void Delete(int id)
        {
            _context.ChatMessages.Remove(GetById(id));
        }

    }
}