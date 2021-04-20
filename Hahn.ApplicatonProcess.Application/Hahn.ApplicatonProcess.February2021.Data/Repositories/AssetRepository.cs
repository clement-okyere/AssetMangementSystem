﻿using Hahn.ApplicatonProcess.February2021.Data.Data;
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
        private AssetContext _context;
        public AssetRepository(AssetContext context)
        {
            _context = context;
        }
        public void Add(Asset asset)
        {
            _context.Assets.Add(asset);
        }

        public void Delete(int id)
        {
            Asset asset = _context.Assets.Find(id);
            _context.Assets.Remove(asset);
        }

        public Asset GetByID(int id)
        {
            return _context.Assets.Find(id);
        }

        public void Update(Asset asset)
        {
            _context.Assets.Attach(asset);
            _context.Entry(asset).State = EntityState.Modified;
        }
    }
}
