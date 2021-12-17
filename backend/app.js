const express = require("express");
const app = express();
const port = 8000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const endPoints = require("./endpoints");

app.use("/api", endPoints);

app.listen(port, () => {
  console.log("Backend listening at http://localhost:" + port);
})