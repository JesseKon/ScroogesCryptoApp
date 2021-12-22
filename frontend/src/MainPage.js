import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import { GetLongestDownwardTrend } from "./helpers/DownwardTrend";
import { GetHighestTradingVolume } from "./helpers/TradingVolume";
import { GetWhenToBuyAndSell } from "./helpers/WhenToBuyAndSell";


export const MainPage = () => {
  const [serverStatus, setServerStatus] = useState("Waiting server status...");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [longestDownwardTrend, setLongestDownwardTrend] = useState({});
  const [highestTradingVolume, setHighestTradingVolume] = useState({});
  const [whenToBuyAndSell, setWhenToBuyAndSell] = useState({});

  // Check server status
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/api/ping");

      if (response.ok) {
        setServerStatus("Server status: all good!");
      }
      else {
        setServerStatus("Server status: something is wrong");
      }
    }

    fetchData();
  }, [])


  const Submit = async (e) => {
    e.preventDefault();

    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
      })
    };

    const response = await fetch("http://localhost:8000/api/getData", request);
    const data = await response.json();

    setLongestDownwardTrend(GetLongestDownwardTrend(data));
    setHighestTradingVolume(GetHighestTradingVolume(data));
    setWhenToBuyAndSell(GetWhenToBuyAndSell(data));
  }


  return (
    <div>
      <p>{serverStatus}</p>

      <form onSubmit={Submit}>
        <p>Start date: </p>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

        <p>End date: </p>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />

        <input type="submit"></input>
      </form>

      <div>
        <h3>Longest downward trend:</h3>

        {longestDownwardTrend.duration === 0 &&
          <div>
            There was no downward trend.
          </div>
        }

        {longestDownwardTrend.duration > 0 &&
          <div>
            Start date: {longestDownwardTrend.startDate.slice(0, 10)} <br />
            End date: {longestDownwardTrend.endDate.slice(0, 10)} <br />
            Duration: {longestDownwardTrend.duration}
          </div>
        }
      </div>

      <div>
        <h3>Highest trading volume:</h3>

        Date: {highestTradingVolume.date} <br />
        Volume: {highestTradingVolume.volume}
      </div>

      <div>
        <h3>When to buy and sell:</h3>

        {!whenToBuyAndSell.shouldBuy &&
          <div>
            Should not buy.
          </div>
        }

        {whenToBuyAndSell.shouldBuy &&
          <div>
            Buy date: {whenToBuyAndSell.buyDate.slice(0, 10)} <br />
            Buy price: {whenToBuyAndSell.buyPrice} <br />
            Sell date: {whenToBuyAndSell.sellDate.slice(0, 10)} <br />
            Sell price: {whenToBuyAndSell.sellPrice}
          </div>
        }
      </div>

    </div>
  );
}