using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Midterm_EquipmentRental_Group2.Data;
using Midterm_EquipmentRental_Group2.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Controllers
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
            var customer = _context.Customers.FirstOrDefault(c => c.Username == request.Username && c.Password == request.Password);
            if (customer == null)
            {
                return Unauthorized("Invalid username or password");
            }
            // In a real application, generate a JWT or similar token here
            var token = GenerateJwtToken(customer);
            return Ok(new { Token = token, Role = customer.Role });
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var customers = _context.Customers.Select(u => new { u.Id, u.Username, u.Role }).ToList();
            return Ok(customers);
        }

        private object GenerateJwtToken(Customer customer)
        {
            var claims = new[]
            {
                new Claim(System.Security.Claims.ClaimTypes.Name, customer.Username),
                new Claim(System.Security.Claims.ClaimTypes.Role, customer.Role.ToString())
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
