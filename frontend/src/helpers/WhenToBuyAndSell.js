/**
 * Find the dates when one should buy (at lowest price) and when to sell (at highest price) currency
 * in order to profit the most from it.
 */
export const GetWhenToBuyAndSell = (data) => {
  let dateRanges = [];

  // Find the biggest profits between all date ranges
  for (let i = 0; i < data.length; ++i) {
    let dateRange = {
      buyDate: data[i].date,
      buyPrice: data[i].price,
      sellDate: "",
      sellPrice: "",
      profit: 0.0
    }

    for (let j = i; j < data.length; ++j) {
      if (data[j].price - data[i].price > dateRange.profit) {
        dateRange.sellDate = data[j].date;
        dateRange.sellPrice = data[j].price;
        dateRange.profit = data[j].price - data[i].price;
      }
    }

    dateRanges.push(dateRange);
  }


  // Iterate through date ranges and find the one that gives most profit
  let dateRangesBestProfitIndex = 0;
  for (let i = 0; i < dateRanges.length; ++i) {
    if (dateRanges[i].profit > dateRanges[dateRangesBestProfitIndex].profit) {
      dateRangesBestProfitIndex = i;
    }
  }

  return {
    shouldBuy:  dateRanges[dateRangesBestProfitIndex].profit !== 0,
    buyDate:    dateRanges[dateRangesBestProfitIndex].buyDate,
    buyPrice:   dateRanges[dateRangesBestProfitIndex].buyPrice,
    sellDate:   dateRanges[dateRangesBestProfitIndex].sellDate,
    sellPrice:  dateRanges[dateRangesBestProfitIndex].sellPrice
  };
}