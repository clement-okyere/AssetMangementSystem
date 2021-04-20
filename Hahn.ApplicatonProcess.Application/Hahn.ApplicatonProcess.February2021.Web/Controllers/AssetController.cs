using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using Hahn.ApplicatonProcess.February2021.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Web.Controllers
{
    [Route("/api/assets")]
    public class AssetController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public AssetController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("id")]
        [ProducesResponseType(typeof(Asset),201)]
        public IActionResult GetById([FromQuery] int id)
        {
            var assets = _unitOfWork.Asset.GetByID(id);
            return Ok(assets);
        }

        [HttpPost]
        [ProducesResponseType(201)]
        public IActionResult Post([FromBody] Asset asset)
        {
            _unitOfWork.Asset.Add(asset);
            _unitOfWork.Save();
            return CreatedAtAction(nameof(GetById), new { id = asset.ID });
        }

        [HttpDelete]
        [ProducesResponseType(200)]
        public IActionResult Delete([FromQuery] int id)
        {
            _unitOfWork.Asset.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
