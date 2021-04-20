using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
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
        public IActionResult GetById([FromQuery] int id)
        {
            var assets = _unitOfWork.Asset.GetByID(id);
            return Ok(assets);
        }
    }
}
