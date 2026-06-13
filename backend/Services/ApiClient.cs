using System.Net.Http.Headers;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Services
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly JwtService _jwtService;

        public ApiClient(HttpClient httpClient, JwtService jwtService)
        {
            _httpClient = httpClient;
            _jwtService = jwtService;
        }

        private void AttachToken(ClaimsPrincipal user)
        {
            var token = _jwtService.GenerateToken(user);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<string> GetProtectedDataAsync(string path, ClaimsPrincipal user) 
        {
            AttachToken(user);
            return await _httpClient.GetStringAsync(path);
        }
    }
}
