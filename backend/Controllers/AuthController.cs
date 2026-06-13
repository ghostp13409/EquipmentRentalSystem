using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Midterm_EquipmentRental_Group2.Data;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // Challenge endpoint - redirects to Google OAuth
        [HttpGet("google-login")]
        public IActionResult Login()
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "/oauth/callback" // This will be handled by the frontend
            }, "Google");
        }

        // Get current user info
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst("UserId")?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value ?? email;

            return Ok(new
            {
                id = userId,
                email = email,
                name = name,
                role = role
            });
        }

        // Check authentication status
        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                var userId = User.FindFirst("UserId")?.Value;
                var name = User.FindFirst(ClaimTypes.Name)?.Value ?? email;

                return Ok(new
                {
                    isAuthenticated = true,
                    user = new
                    {
                        id = userId,
                        email = email,
                        name = name,
                        role = role
                    }
                });
            }

            return Ok(new { isAuthenticated = false });
        }

        // Logout endpoint
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
