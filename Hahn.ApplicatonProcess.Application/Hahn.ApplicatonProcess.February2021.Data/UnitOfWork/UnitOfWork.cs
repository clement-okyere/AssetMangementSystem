using Hahn.ApplicatonProcess.February2021.Data.Data;
using Hahn.ApplicatonProcess.February2021.Data.Repositories;
using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Data.UnitOfWork
{
    public class UnitOfWork: IUnitOfWork
    {
        private readonly AssetContext _context;
        public UnitOfWork(AssetContext context)
        {
            _context = context;
            Asset = new AssetRepository(_context);
        }

        public IAssetRepository Asset { get ; }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
