using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Repositories.Interfaces
{
    public interface IChatMessageRepository : IRepository<ChatMessage>
    {
        IEnumerable<ChatMessage> GetMessagesByRentalId(int rentalId);
        void DeleteOlderThan(DateTime cutoff);
    }
}