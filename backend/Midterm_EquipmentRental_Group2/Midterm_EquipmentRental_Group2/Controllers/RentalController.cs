using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Midterm_EquipmentRental_Group2.Models;
using Midterm_EquipmentRental_Group2.UnitOfWork;
using System.Security.Claims;

namespace Midterm_EquipmentRental_Group2.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RentalController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;

		public RentalController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
        }

		[HttpGet]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetAllRentals()
		{
			try
			{
				if (IsAdmin())
				{
					var rentals = _unitOfWork.Rentals.GetAll();
					return Ok(rentals);
                }
				else
				{
					var customerId = GetCurrentUserId();
					var userRentals = _unitOfWork.Rentals.GetRentalsByCustomer(customerId);
					return Ok(userRentals);
                }
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

		[HttpGet("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetRentalById(int id)
		{
            try
            {
                var rental = _unitOfWork.Rentals.GetById(id);
                if (rental == null)
                    return NotFound(new { message = "Rental not found" });

                // Check authorization: User can only view their own rentals
                if (!IsAdmin() && rental.CustomerId != GetCurrentUserId())
                    return Forbid();

                return Ok(rental);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving rental", error = ex.Message });
            }
        }

		[HttpGet("active")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetActiveRentals()
		{
            try
            {
                var activeRentals = _unitOfWork.Rentals.GetAll()
                    .Where(r => r.Status == Status.Active)
                    .ToList();

                // Users only see their own active rentals
                if (!IsAdmin())
                {
                    var customerId = GetCurrentUserId();
                    activeRentals = activeRentals.Where(r => r.CustomerId == customerId).ToList();
                }

                return Ok(activeRentals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving active rentals", error = ex.Message });
            }
        }

        [HttpGet("completed")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetCompletedRentals()
        {
            try
            {
                var completedRentals = _unitOfWork.Rentals.GetAll()
                    .Where(r => r.Status == Status.Completed)
                    .ToList();

                // Users only see their own completed rentals
                if (!IsAdmin())
                {
                    var customerId = GetCurrentUserId();
                    completedRentals = completedRentals.Where(r => r.CustomerId == customerId).ToList();
                }

                return Ok(completedRentals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving completed rentals", error = ex.Message });
            }
        }

        [HttpGet("overdue")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetOverdueRentals()
        {
            try
            {
                var overdueRentals = _unitOfWork.Rentals.GetAll()
                    .Where(r => r.DueDate < DateTime.Now && r.ReturnedAt == null && r.Status == Status.Active)
                    .ToList();

                return Ok(overdueRentals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving overdue rentals", error = ex.Message });
            }
        }

        [HttpGet("equipment/{equipmentId}")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetEquipmentRentalHistory(int equipmentId)
        {
            try
            {
                // equipment exists
                var equipment = _unitOfWork.Equipments.GetById(equipmentId);
                if (equipment == null)
                    return NotFound(new { message = "Equipment not found" });

                var rentalHistory = _unitOfWork.Rentals.GetAll()
                    .Where(r => r.EquipmentId == equipmentId)
                    .OrderByDescending(r => r.IssuedAt)
                    .ToList();

                return Ok(rentalHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving equipment rental history", error = ex.Message });
            }
        }



        [HttpPost("issue")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult IssueEquipment(Rental rental)
		{
			try
			{
				// Custoemr Exists
				var customer = _unitOfWork.Customers.GetById(rental.CustomerId);
				if (customer == null)
				{
					return BadRequest(new {message = "Customer not found"});
				}
				// Equipment Exists
				var equipment = _unitOfWork.Equipments.GetById(rental.EquipmentId);
				if (equipment == null)
				{
					return BadRequest(new { message = "Equipment not found" });
                }

                // Equipment Available
				if (!equipment.IsAvailable)
				{
					return BadRequest(new { message = "Equipment is not available for rental" });
                }
				// User already has a rental
				if (_unitOfWork.Rentals.HasActiveRental(rental.CustomerId))
				{
                    return BadRequest(new { message = "You already has an active rental. Return it first." });
                }

				// Set Rental Deatails
				rental.IssuedAt = DateTime.UtcNow;
				rental.Status = Status.Active;


				// Add Rental
				_unitOfWork.Rentals.Add(rental);

				_unitOfWork.Save();

				equipment.IsAvailable = false;
				_unitOfWork.Equipments.Update(equipment);
				_unitOfWork.Save();

				return CreatedAtAction(nameof(GetRentalById), new { id = rental.Id }, rental);
            }
			catch (Exception ex)
			{
                return StatusCode(500, new { message = "Error creating rental", error = ex.Message });
            }
        }

        [HttpPost("return")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult ReturnEquipment([FromBody] ReturnRentalRequest request)
        {
            try
            {
                var rental = _unitOfWork.Rentals.GetById(request.RentalId);
                if (rental == null)
                    return NotFound(new { message = "Rental not found" });

                // Authorization: User can only return their own rentals
                if (!IsAdmin() && rental.CustomerId != GetCurrentUserId())
                    return Forbid();

                // Business rule: Can only return active rentals
                if (rental.Status != Status.Active)
                    return BadRequest(new { message = "Only active rentals can be returned" });

                // Update rental
                rental.ReturnedAt = DateTime.UtcNow;
                rental.Status = Status.Completed;
                rental.ConditionOnReturn = request.ConditionOnReturn;
                rental.Notes = request.Notes;

                // Update equipment availability
                var equipment = _unitOfWork.Equipments.GetById(rental.EquipmentId);
                if (equipment != null)
                {
                    equipment.IsAvailable = true;
                    _unitOfWork.Equipments.Update(equipment);
                }

                _unitOfWork.Rentals.Update(rental);
                _unitOfWork.Save();

                return Ok(new { message = "Equipment returned successfully", rental });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error returning equipment", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult ExtendRental(int id, [FromBody] ExtendRentalRequest request)
        {
            try
            {
                var rental = _unitOfWork.Rentals.GetById(id);
                if (rental == null)
                    return NotFound(new { message = "Rental not found" });

                // Can only extend active rentals
                if (rental.Status != Status.Active)
                    return BadRequest(new { message = "Only active rentals can be extended" });

                // Validate due date is in future
                if (request.NewDueDate <= rental.DueDate)
                    return BadRequest(new { message = "New due date must be after current due date" });

                // Update rental
                rental.DueDate = request.NewDueDate;
                _unitOfWork.Rentals.Update(rental);
                _unitOfWork.Save();

                return Ok(new { message = "Rental extended successfully", rental });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error extending rental", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult CancelRental(int id)
        {
            try
            {
                var rental = _unitOfWork.Rentals.GetById(id);
                if (rental == null)
                    return NotFound(new { message = "Rental not found" });

                // Cannot cancel completed rentals
                if (rental.Status == Status.Completed)
                    return BadRequest(new { message = "Cannot cancel completed rentals" });

                // Restore equipment availability if rental was active
                if (rental.Status == Status.Active)
                {
                    var equipment = _unitOfWork.Equipments.GetById(rental.EquipmentId);
                    if (equipment != null)
                    {
                        equipment.IsAvailable = true;
                        _unitOfWork.Equipments.Update(equipment);
                    }
                }

                _unitOfWork.Rentals.Delete(id);
                _unitOfWork.Save();

                return Ok(new { message = "Rental cancelled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error cancelling rental", error = ex.Message });
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
