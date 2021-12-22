const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");


// Server status
router.get("/ping", async (req, res) => {
  const response = await fetch("https://api.coingecko.com/api/v3/ping");

  if (response.ok) {
    console.log("CoinGecko server all good");
    res.sendStatus(200);
  }
  else {
    console.log("CoinGecko server not responding");
    res.sendStatus(503);
  }
})


// Get currency data
router.post("/getData", async (req, res) => {
  console.log("/getData request");

  const parsedStartDate = req.body.startDate.slice(0, 10);
  const startDateUnixTime = Math.floor(new Date(parsedStartDate).getTime() / 1000);
  console.log("Start date: [" + parsedStartDate + "], unix time: [" + startDateUnixTime + "]");

  const parsedEndDate = req.body.endDate.slice(0, 10);
  const endDateUnixTime = Math.floor(new Date(parsedEndDate).getTime() / 1000 + (60 * 60)); // Add 1 hour
  console.log("End date: [" + parsedEndDate + "], unix time: [" + endDateUnixTime + "]");

  const currencyFrom = "bitcoin";
  const currencyTo = "eur";
  const url = "https://api.coingecko.com/api/v3/coins/" + currencyFrom + "/market_chart/"
    + "range?vs_currency=" + currencyTo + "&from=" + startDateUnixTime + "&to=" + endDateUnixTime;
  
  const response = await fetch(url);
  const data = await response.json();

  // TODO: fail check

  /**
   * Iterate through the response data
   * Only the first result from each day is needed
   */
  const oneDayInUnixTime = 60 * 60 * 24;
  let currentDateInUnixTime = startDateUnixTime;
  let dateCounter = 0;
  let results = [];

  for (let i = 0; i < data.prices.length; ++i) {
    /**
     * CoinGecko's unix time might not be exactly at 0000 UTC
     * take the closest one after 0000 UTC
     * Also, CoinGecko's unix time is in milliseconds, hence division by 1000
     */
    if (data.prices[i][0] / 1000 >= currentDateInUnixTime) {
      currentDate = new Date(parsedStartDate);
      currentDate.setDate(currentDate.getDate() + dateCounter);

      results.push({
        "unix_time": data.prices[i][0],
        "date": currentDate,
        "price": data.prices[i][1],
        "market_cap": data.market_caps[i][1],
        "total_volume": data.total_volumes[i][1],
      });

      ++dateCounter;

      currentDateInUnixTime += oneDayInUnixTime;
      if (currentDateInUnixTime >= endDateUnixTime)
        break;
    }
  }

  res.json(results);
})

module.exports = router;