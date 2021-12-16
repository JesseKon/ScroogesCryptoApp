const express = require("express");
const app = express();
const port = 8000;

const fetch = require("node-fetch");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


app.get("/ping", async (req, res) => {
  const response = await fetch("https://api.coingecko.com/api/v3/ping");

  if (response.ok) {
    console.log("Coingecko server all good");
    res.sendStatus(200);
  }
  else {
    console.log("Coingecko server not responding");
    res.sendStatus(503);
  }
})


app.listen(port, () => {
  console.log("Backend listening at http://localhost:" + port);
})