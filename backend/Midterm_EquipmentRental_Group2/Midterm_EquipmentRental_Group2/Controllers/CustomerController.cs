using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.UnitOfWork;

namespace Midterm_EquipmentRental_Group2.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomerController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;

		public CustomerController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
        }

		[HttpGet]
		[Authorize(Roles = "Admin")]
		public IActionResult GetAllCustomers()
		{
			var customers = _unitOfWork.Customers.GetAll();
			return Ok(customers);
        }

		[HttpGet("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetCustomerById(int id)
		{
			if (!IsAdmin() && id != GetCurrentUserId())
			{
				return Forbid();
			}
			var customer = _unitOfWork.Customers.GetById(id);
			if (customer == null)
			{
				return NotFound();
			}
			return Ok(customer);
        }

		[HttpGet("{id}/rentals")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetCustomerRentals(int id)
		{
			var currentCustomer = _unitOfWork.Customers.GetById(GetCurrentUserId());
			if (currentCustomer == null || (!IsAdmin() && currentCustomer.Id != id))
			{
				return Forbid();
            }
			var rentals = _unitOfWork.Rentals.GetRentalsByCustomer(id);
			return Ok(rentals);
        }

		[HttpGet("{id}/active-rental")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetCustomerActiveRentals(int id)
		{
            var currentCustomer = _unitOfWork.Customers.GetById(GetCurrentUserId());
            if (currentCustomer == null || (!IsAdmin() && currentCustomer.Id != id))
            {
                return Forbid();
            }
			var rental = _unitOfWork.Customers.GetActiveRentalByCustomer(id);
			return Ok(rental);
        }

        [HttpPost]
		[Authorize(Roles = "Admin")]
		public IActionResult CreateCustomer(Customer customer)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
            }
            _unitOfWork.Customers.Add(customer);
			_unitOfWork.Save();
			return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, customer);
        }

		[HttpPut("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult UpdateCustomer(int id, Customer customer)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
            }
			var currentUser = _unitOfWork.Customers.GetById(id);
			if (currentUser == null || (!IsAdmin() && currentUser.Id != id) || !ModelState.IsValid)
			{
				return BadRequest();
            }

			_unitOfWork.Customers.Update(customer);
			_unitOfWork.Save();

			return NoContent();
        }

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public IActionResult DeleteCustomer(int id)
		{
			var customer = _unitOfWork.Customers.GetById(id);
            if(customer == null)
			{
				return NotFound();
            }
			_unitOfWork.Customers.Delete(id);
			_unitOfWork.Save();
			return NoContent();

        }

        private bool IsAdmin()
		{
			return User.IsInRole("Admin");
        }

		private int GetCurrentUserId()
		{
			return int.Parse(User.FindFirst("UserId").Value);
        }
    }
}
