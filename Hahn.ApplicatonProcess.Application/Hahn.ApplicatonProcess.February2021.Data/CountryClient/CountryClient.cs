using Hahn.ApplicatonProcess.February2021.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Hahn.ApplicatonProcess.February2021.Data.CountryClient
{
    public class CountryClient: ICountryClient
    {
        private HttpClient _client;

        public CountryClient(HttpClient client)
        {
            _client = client;     
        }

        public async Task<bool> ValidateCountry(string country)
        {

            var response = await _client.GetAsync($"/rest/v2/name/{country}?fullText=true");

            if (response.StatusCode == HttpStatusCode.NotFound)
                return false;

            return true;
        }
    }
}
