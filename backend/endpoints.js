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
  res.json(data);
})



module.exports = router;