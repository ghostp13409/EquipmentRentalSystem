using Microsoft.AspNetCore.SignalR;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.UnitOfWork;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;

        public ChatHub(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task JoinRentalGroup(int rentalId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Rental-{rentalId}");

            // Send existing messages to the user who just joined
            var messages = _unitOfWork.ChatMessages.GetMessagesByRentalId(rentalId);
            await Clients.Caller.SendAsync("LoadMessages", messages);
        }

        public async Task LeaveRentalGroup(int rentalId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Rental-{rentalId}");
        }

        public async Task SendMessage(int rentalId, string message)
        {
            var userEmail = Context.User?.FindFirst(ClaimTypes.Email)?.Value;
            var userName = Context.User?.Identity?.Name;

            if (string.IsNullOrEmpty(userEmail))
            {
                userEmail = "Unknown User";
            }

            var chatMessage = new ChatMessage
            {
                RentalId = rentalId,
                UserEmail = userEmail,
                Name = userName ?? "Unknown",
                Text = message,
                SentAtUtc = DateTime.UtcNow
            };

            _unitOfWork.ChatMessages.Add(chatMessage);
            _unitOfWork.Save();

            await Clients.Group($"Rental-{rentalId}").SendAsync("ReceiveMessage", chatMessage);
        }
    }
}