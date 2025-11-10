using Microsoft.IdentityModel.Tokens;
using Midterm_EquipmentRental_Group2.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(ClaimsPrincipal user, TimeSpan? lifetime = null)
        {
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:SigningKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var now = DateTime.UtcNow;



            var claims = new List<Claim>
            {
                new (ClaimTypes.NameIdentifier, user.FindFirstValue(ClaimTypes.NameIdentifier)),
                new (ClaimTypes.Name, user.Identity.Name),
                new (ClaimTypes.Email, user.FindFirstValue(ClaimTypes.Email)),
            };

            foreach (var role in user.FindAll(ClaimTypes.Role).Select(c => c.Value).Distinct())
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(lifetime ?? TimeSpan.FromHours(1)),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
