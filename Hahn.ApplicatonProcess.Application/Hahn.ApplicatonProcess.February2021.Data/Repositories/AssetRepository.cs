using Hahn.ApplicatonProcess.February2021.Data.Data;
using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using Hahn.ApplicatonProcess.February2021.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Data.Repositories
{
    public class AssetRepository : IAssetRepository
    {
        private readonly AssetContext _context;
        private readonly DbSet<Asset> _entities;
        public AssetRepository(AssetContext context)
        {
            _context = context;
            _entities = _context.Set<Asset>();
        }
        public void Add(Asset asset)
        {
            _entities.Add(asset);          
        }

        public void Delete(int id)
        {
            Asset asset = _entities.Find(id);
            _entities.Remove(asset);
        }

        public Asset GetByID(int id)
        {
            return _entities.Find(id);
        }

        public void Update(int id, Asset asset)
        {
            var assetToUpdate = _entities.FirstOrDefault(asset => asset.ID == id);
            assetToUpdate.CountryofDepartment = asset.CountryofDepartment;
            assetToUpdate.AssetName = asset.AssetName;
            assetToUpdate.PurchaseDate = asset.PurchaseDate;
            assetToUpdate.Department = asset.Department;
            assetToUpdate.EmailAddressofDepartment = asset.EmailAddressofDepartment;
        }
    }
}
