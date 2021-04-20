﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        IAssetRepository Asset { get; }
        void Save();
    }
}
