using Swashbuckle.AspNetCore.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Domain.Models
{
    public class AssetExample : IExamplesProvider<Asset>
    {
        public Asset GetExamples()
        {
            return new Asset
            {
                ID = 0,
                AssetName = "Keyboard",
                CountryofDepartment = "Germany",
                EmailAddressofDepartment = "asset@example.com",
                PurchaseDate = DateTime.Now,
                broken = false,
                Department = 0
            };
        }
    }
}
