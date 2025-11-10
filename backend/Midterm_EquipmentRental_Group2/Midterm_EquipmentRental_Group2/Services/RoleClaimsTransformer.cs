using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Services
{
    public class RoleClaimsTransformer: IClaimsTransformation
    {
        private readonly IConfiguration configuration;
        public RoleClaimsTransformer(IConfiguration configuration)
        {
            this.configuration = configuration;
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
            var adminEmails = configuration.GetSection("AuthDemo:AdminEmails").Get<List<string>>() ?? new List<string>();

            var role = adminEmails.Contains(email) ? "Admin" : "User";

            //add role claim
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
            return Task.FromResult(principal);
        }
    }
}
