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
	public class EquipmentController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;

		public EquipmentController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
		}

		[HttpGet]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetAllEquipment()
		{
			try
			{
				var equipments = _unitOfWork.Equipments.GetAll();
				return Ok(equipments);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving equipment", error = ex.Message });
			}
		}

		[HttpGet("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetEquipmentById(int id)
		{
			try
			{
				var equipment = _unitOfWork.Equipments.GetById(id);
				if (equipment == null)
				{
					return NotFound();
				}
				return Ok(equipment);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving equipment", error = ex.Message });
			}
		}

		[HttpGet("available")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetAvailableEquipment()
		{
			try
			{
				var equipments = _unitOfWork.Equipments.GetAvailableEquipment();
				return Ok(equipments);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving available equipment", error = ex.Message });
			}
		}

		[HttpGet("rented")]
		[Authorize(Roles = "Admin")]
		public IActionResult GetRentedEquipment()
		{
			try
			{
				var equipments = _unitOfWork.Equipments.GetRentedEquipment();
				return Ok(equipments);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error retrieving rented equipment", error = ex.Message });
			}
		}

		[HttpPost]
		[Authorize(Roles = "Admin,User")]
		public IActionResult CreateEquipment(CreateEquipmentDto dto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			try
			{
				var equipment = new Equipment
				{
					Name = dto.Name,
					Description = dto.Description,
					Category = dto.Category,
					Condition = dto.Condition,
					RentalPrice = dto.RentalPrice,
					IsAvailable = true,
					CreatedAt = DateTime.UtcNow
				};
				_unitOfWork.Equipments.Add(equipment);
				_unitOfWork.Save();
				return CreatedAtAction(nameof(GetEquipmentById), new { id = equipment.Id }, equipment);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpPut("{id}")]
		[Authorize(Roles = "Admin")]
		public IActionResult UpdateEquipment(int id, Equipment equipment)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				if (id != equipment.Id)
				{
					return BadRequest();
				}
				var existingEquipment = _unitOfWork.Equipments.GetById(id);
				if (existingEquipment == null)
				{
					return NotFound();
				}
				existingEquipment.Name = equipment.Name;
				existingEquipment.Description = equipment.Description;
				existingEquipment.Category = equipment.Category;
				existingEquipment.Condition = equipment.Condition;
				existingEquipment.RentalPrice = equipment.RentalPrice;
				existingEquipment.IsAvailable = equipment.IsAvailable;
				_unitOfWork.Save();
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error updating equipment", error = ex.Message });
			}
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
		public IActionResult DeleteEquipment(int id)
		{
			try
			{
				var existingEquipment = _unitOfWork.Equipments.GetById(id);
				if (existingEquipment == null)
				{
					return NotFound();
				}
				_unitOfWork.Equipments.Delete(id);
				_unitOfWork.Save();
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Error deleting equipment", error = ex.Message });
			}
		}
	}
}
