using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using Hahn.ApplicatonProcess.February2021.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<AssetController> _logger;
        public AssetController(IUnitOfWork unitOfWork, ILogger<AssetController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("id")]
        [ProducesResponseType(typeof(Asset),201)]
        public IActionResult GetById([FromQuery] int id)
        {
            _logger.LogInformation($"Fetching asset with id {id}");
            var assets = _unitOfWork.Asset.GetByID(id);
            return Ok(assets);
        }

        [HttpPost]
        [ProducesResponseType(201)]
        public IActionResult Post([FromBody] Asset asset)
        {
            _logger.LogInformation("Adding new asset {asset}", asset.AssetName);
            _unitOfWork.Asset.Add(asset);
            _unitOfWork.Save();
            return CreatedAtAction(nameof(GetById), new { id = asset.ID });
        }

        [HttpDelete]
        [ProducesResponseType(200)]
        public IActionResult Delete([FromQuery] int id)
        {
            _logger.LogInformation($"Deleting asset with id {id}");
            _unitOfWork.Asset.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }

        [HttpPut("id")]
        [ProducesResponseType(200)]
        public IActionResult Update([FromQuery] int id, [FromBody] Asset asset)
        {
            _logger.LogInformation("updating asset with id {id} with {asset}", id, asset);
            _unitOfWork.Asset.Update(id, asset);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
