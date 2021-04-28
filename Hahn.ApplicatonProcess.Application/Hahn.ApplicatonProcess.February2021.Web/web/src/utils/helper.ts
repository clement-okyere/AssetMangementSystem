import * as moment from "moment";


export const getYearDifference = (purchaseDate: Date): number => {
  let dateBought = moment(purchaseDate, "YYYY-MM-DD");
  return moment().diff(dateBought, "years");
};

