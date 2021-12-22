import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

import { GetLongestDownwardTrend } from "./helpers/DownwardTrend";
import { GetHighestTradingVolume } from "./helpers/TradingVolume";


export const MainPage = () => {
  const [serverStatus, setServerStatus] = useState("Waiting server status...");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [longestDownwardTrend, setLongestDownwardTrend] = useState({startDate: "", endDate: "", duration: 0})
  const [highestTradingVolume, setHighestTradingVolume] = useState({date: "", volume: 0.0});

  const [outputJson, setOutputJson] = useState();

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
    setOutputJson(data);  // For debugging only

    setLongestDownwardTrend(GetLongestDownwardTrend(data));
    setHighestTradingVolume(GetHighestTradingVolume(data));

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

    <p>{JSON.stringify(outputJson)}</p>

    <div>
      <h3>Longest downward trend:</h3>
      Start date: {longestDownwardTrend.startDate} <br />
      End date: {longestDownwardTrend.endDate} <br />
      Duration: {longestDownwardTrend.duration}
    </div>

    <div>
      <h3>Highest trading volume:</h3>
      Date: {highestTradingVolume.date} <br />
      Volume: {highestTradingVolume.volume}
    </div>


    </div>
  );
}