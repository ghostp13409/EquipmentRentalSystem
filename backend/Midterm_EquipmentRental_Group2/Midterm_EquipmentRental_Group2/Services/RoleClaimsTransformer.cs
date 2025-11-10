using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Midterm_EquipmentRental_Group2.UnitOfWork;
using Midterm_EquipmentRental_Group2.Models;

namespace Midterm_EquipmentRental_Group2.Services
{
    public class RoleClaimsTransformer : IClaimsTransformation
    {
        private readonly IConfiguration configuration;
        private readonly IUnitOfWork _unitOfWork;

        public RoleClaimsTransformer(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            this.configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            //only transform authenticated identities
            var identity = principal.Identities.FirstOrDefault(i => i.IsAuthenticated);
            if (identity == null)
            {
                return Task.FromResult(principal);
            }

            //if role claim already exists, do nothing
            if (identity.HasClaim(c => c.Type == ClaimTypes.Role))
            {
                return Task.FromResult(principal);
            }

            //determine role based on email
            var email = principal.FindFirstValue(ClaimTypes.Email);
            var name = principal.FindFirstValue(ClaimTypes.Name) ?? email;
            var externalId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            var adminEmails = configuration.GetSection("AuthDemo:AdminEmails").Get<List<string>>() ?? new List<string>();
            var role = adminEmails.Contains(email) ? "Admin" : "User";

            // Add user to database if not exists
            if (!string.IsNullOrEmpty(externalId))
            {
                var customer = _unitOfWork.Customers.GetAll().FirstOrDefault(c => c.ExternalId == externalId);
                if (customer == null)
                {
                    customer = new Customer
                    {
                        Name = name,
                        Email = email,
                        ExternalProvider = "Google",
                        ExternalId = externalId,
                        Role = role == "Admin" ? Role.Admin : Role.User,
                        CreatedAt = DateTime.UtcNow
                    };
                    _unitOfWork.Customers.Add(customer);
                    _unitOfWork.Save();
                }
                // Add UserId claim
                if (!identity.HasClaim(c => c.Type == "UserId"))
                {
                    identity.AddClaim(new Claim("UserId", customer.Id.ToString()));
                }
            }

            //add role claim
            identity.AddClaim(new Claim(ClaimTypes.Role, role));

            return Task.FromResult(principal);
        }
    }
}
