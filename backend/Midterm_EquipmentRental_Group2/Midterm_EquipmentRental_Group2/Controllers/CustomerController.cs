using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Midterm_EquipmentRental_Group2.DTOs;
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
			try
			{
				var customers = _unitOfWork.Customers.GetAll();
				return Ok(customers);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving customers", error = ex.Message });
			}
		}

		[HttpGet("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetCustomerById(int id)
		{
			try
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
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving customer", error = ex.Message });
			}
		}

		[HttpGet("{id}/rentals")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetCustomerRentals(int id)
		{
			try
			{
				var currentCustomer = _unitOfWork.Customers.GetById(GetCurrentUserId());
				if (currentCustomer == null || (!IsAdmin() && currentCustomer.Id != id))
				{
					return Forbid();
				}
				var rentals = _unitOfWork.Rentals.GetRentalsByCustomer(id);
				return Ok(rentals);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving customer rentals", error = ex.Message });
			}
		}

		[HttpGet("{id}/active-rental")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetCustomerActiveRentals(int id)
		{
			try
			{
				var currentCustomer = _unitOfWork.Customers.GetById(GetCurrentUserId());
				if (currentCustomer == null || (!IsAdmin() && currentCustomer.Id != id))
				{
					return Forbid();
				}
				var rental = _unitOfWork.Customers.GetActiveRentalByCustomer(id);
				return Ok(rental);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving customer active rentals", error = ex.Message });
			}
		}

		[HttpPost]
		public IActionResult CreateCustomer(CreateCustomerDto dto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			try
			{
				var customer = new Customer
				{
					Name = dto.Name,
					Email = dto.Email,
					Username = dto.Username,
					Password = dto.Password,
					Role = Role.User,
					CreatedAt = DateTime.UtcNow
				};
				_unitOfWork.Customers.Add(customer);
				_unitOfWork.Save();
				return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, customer);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpPut("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult UpdateCustomer(int id, UpdateCustomerDto customer)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var currentUser = _unitOfWork.Customers.GetById(id);
			if (currentUser == null)
			{
				return NotFound();
			}
			if (!IsAdmin() && GetCurrentUserId() != id)
			{
				return Forbid();
			}

			try
			{
				currentUser.Name = customer.Name;
				currentUser.Email = customer.Email;
				currentUser.Username = customer.Username;
				if (!string.IsNullOrEmpty(customer.Password))
				{
					currentUser.Password = customer.Password; // Note: In production, hash the password
				}
				if (IsAdmin())
				{
					currentUser.Role = Enum.Parse<Role>(customer.Role);
				}
				_unitOfWork.Save();

				return Ok(currentUser);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public IActionResult DeleteCustomer(int id)
		{
			try
			{
				var customer = _unitOfWork.Customers.GetById(id);
				if (customer == null)
				{
					return NotFound();
				}
				_unitOfWork.Customers.Delete(id);
				_unitOfWork.Save();
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error deleting customer", error = ex.Message });
			}
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
