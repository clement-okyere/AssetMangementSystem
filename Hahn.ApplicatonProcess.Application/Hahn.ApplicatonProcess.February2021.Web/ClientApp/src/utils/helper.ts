import * as moment from "moment";
import { HttpClient } from "aurelia-http-client";

export const getYearDifference = (purchaseDate: Date): number => {
  let dateBought = moment(purchaseDate, "YYYY-MM-DD");
  return moment().diff(dateBought, "years");
};

export const validateCountry = async (country: string): Promise<boolean> => {
  try {
    const API_ENDPOINT = `https://restcountries.eu/rest/v2/name/${country}?fullText=true`;
    const httpClient: HttpClient = new HttpClient();

    const result = await httpClient.get(API_ENDPOINT);

    if (result.statusCode == 200) return true;
  } catch (err) {
    return false;
  }
};
