using Midterm_EquipmentRental_Group2.UnitOfWork;

namespace Midterm_EquipmentRental_Group2.Services
{
    public class MessageCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromSeconds(10);      // Check every 10 seconds
        private readonly TimeSpan _messageLifetime = TimeSpan.FromMinutes(1);       // Message deletion time

        public MessageCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var cutoff = DateTime.UtcNow.Subtract(_messageLifetime);
                    //Remove products older than 1 minute
                    unitOfWork.ChatMessages.DeleteOlderThan(cutoff);
                    unitOfWork.Save();

                }

                await Task.Delay(_cleanupInterval, stoppingToken);
            }
        }
    }
}