using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hahn.ApplicatonProcess.February2021.Domain.Models
{
    public class Asset
    {
        public int ID { get; set; }
        public string AssetName { get; set; }
        public Department Department { get; set; }
        public string CountryofDepartment { get; set; }
        public  string EmailAddressofDepartment { get; set; }
        [NotMapped]
        private DateTime purchaseDate { get; set; }
        public DateTime PurchaseDate {
            get { return purchaseDate; }
            set
            {

                purchaseDate = value.ToUniversalTime();
            }

        }
        [DefaultValue(false)]
        public bool broken { get; set; }
    }

   public enum Department
    {
        HQ,
        Store1,
        Store2,
        Store3,
        MaintenanceStation
    }
}
