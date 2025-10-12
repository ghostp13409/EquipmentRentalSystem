using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Midterm_EquipmentRental_Gurnoor_Parth.Data;
using Midterm_EquipmentRental_Gurnoor_Parth.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Gurnoor_Parth.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		AppDbContext _context;

		public AuthController(AppDbContext context)
		{
			_context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username && u.Password == request.Password);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }
            // In a real application, generate a JWT or similar token here
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, Role = user.Role });
        }

        private object GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(System.Security.Claims.ClaimTypes.Name, user.Username),
                new Claim(System.Security.Claims.ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("YourSecretKeyHere1234567890Something"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                //issuer: "yourdomain.com",
                //audience: "yourdomain.com",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
