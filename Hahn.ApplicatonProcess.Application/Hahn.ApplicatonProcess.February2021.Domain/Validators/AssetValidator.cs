using FluentValidation;
using Hahn.ApplicatonProcess.February2021.Data.CountryClient;
using Hahn.ApplicatonProcess.February2021.Domain.Models;
using Itenso.TimePeriod;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Domain.Validators
{
    public class AssetValidator: AbstractValidator<Asset>
    {
        CountryClient _client;
        public AssetValidator(CountryClient client)
        {
            _client = client;

            RuleFor(x => x.AssetName).MinimumLength(5).WithMessage("AssetName should be at least five characters long");
            RuleFor(x => x.Department).IsInEnum();
            //RuleFor(x => x.CountryofDepartment).

            RuleFor(x => x.CountryofDepartment).MustAsync(async (country, cancellation) =>
            {
                bool exists = await _client.GetCountryByName(country);
                return exists;
            }).WithMessage("Country must be valid");
            RuleFor(x => x.PurchaseDate).Custom((purchaseDate, context) =>
            {
                int differenceInYears = new DateDiff(purchaseDate, DateTime.Now).Years;
                if (differenceInYears > 1)
                    context.AddFailure("Purchase Date must not be older than one year");
            });

            RuleFor(x => x.EmailAddressofDepartment).EmailAddress().NotNull().WithMessage("Email Address of department cannot be null");
            RuleFor(x => x.broken).NotNull().WithMessage("broken cannot be null");
        }
    }
}
