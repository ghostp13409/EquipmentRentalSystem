using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
			var equipments = _unitOfWork.Equipments.GetAll();
			return Ok(equipments);
        }

		[HttpGet("{id}")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetEquipmentById(int id)
		{
			var equipment = _unitOfWork.Equipments.GetById(id);
			if (equipment == null)
			{
				return NotFound();
            }
			return Ok(equipment);
        }

		[HttpGet("available")]
		[Authorize(Roles = "Admin,User")]
		public IActionResult GetAvailableEquipment()
		{
			var equipments = _unitOfWork.Equipments.GetAvailableEquipment();
			return Ok(equipments);
        }

		[HttpGet("rented")]
		[Authorize(Roles = "Admin")]
		public IActionResult GetRentedEquipment()
		{
			var equipments = _unitOfWork.Equipments.GetRentedEquipment();
			return Ok(equipments);
        }

        [HttpPost]
		[Authorize(Roles = "Admin")]
		public IActionResult CreateEquipment(Equipment equipment)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			_unitOfWork.Equipments.Add(equipment);
			_unitOfWork.Save();
			return CreatedAtAction(nameof(GetEquipmentById), new { id = equipment.Id }, equipment);
        }

		[HttpPut("{id}")]
		[Authorize(Roles = "Admin")]
        public IActionResult UpdateEquipment(int id, Equipment equipment)
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
			_unitOfWork.Equipments.Update(equipment);
			_unitOfWork.Save();
			return NoContent();
        }

		[HttpDelete("{id}")]
		[Authorize(Roles = "Admin")]
        public IActionResult DeleteEquipment(int id)
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
    }
}
