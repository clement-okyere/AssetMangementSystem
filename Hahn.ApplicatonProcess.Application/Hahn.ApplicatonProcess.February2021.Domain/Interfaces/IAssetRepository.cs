using Hahn.ApplicatonProcess.February2021.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Domain.Interfaces
{
    public interface IAssetRepository
    {
        void Add(Asset asset);
        Asset GetByID(int id);
        void Update(Asset asset);
        void Delete(int id);
    }
}
