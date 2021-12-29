import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import { currenciesFromOptions, currenciesToOptions } from "./helpers/Currencies";
import { GetChartDataPoints } from "./helpers/ChartDataPoints";
import { GetLongestDownwardTrend } from "./helpers/DownwardTrend";
import { GetHighestTradingVolume } from "./helpers/TradingVolume";
import { GetWhenToBuyAndSell } from "./helpers/WhenToBuyAndSell";


export const MainPage = () => {
  const [serverStatus, setServerStatus] = useState("Waiting server status...");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currencyFrom, setCurrencyFrom] = useState(currenciesFromOptions[0].value);
  const [currencyTo, setCurrencyTo] = useState(currenciesToOptions[0].value);

  const [chartDataPoints, setChartDataPoints] = useState({});
  const [longestDownwardTrend, setLongestDownwardTrend] = useState({});
  const [highestTradingVolume, setHighestTradingVolume] = useState({});
  const [whenToBuyAndSell, setWhenToBuyAndSell] = useState({});
  const [dataIsSet, setDataIsSet] = useState(false);



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
        currencyFrom: currencyFrom,
        currencyTo: currencyTo
      })
    };

    const response = await fetch("http://localhost:8000/api/getData", request);
    const data = await response.json();

    setChartDataPoints(GetChartDataPoints(data));
    setLongestDownwardTrend(GetLongestDownwardTrend(data));
    setHighestTradingVolume(GetHighestTradingVolume(data));
    setWhenToBuyAndSell(GetWhenToBuyAndSell(data));
    setDataIsSet(true);
  }


  return (
    <div>
      <p>{serverStatus}</p>

      <form onSubmit={Submit}>
        <div>
          Start date: 
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div><br />
        
        <div>
          End date: 
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div><br />

        <div>
          Currency from:<br />
          <select value={currencyFrom} onChange={(e) => setCurrencyFrom(e.target.value)}>
            {currenciesFromOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div><br />

        <div>
          Currency to:<br />
          <select value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value)}>
            {currenciesToOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div><br />

        <input type="submit"></input>
      </form>

      <div>
        <h3>Trend and when to buy & sell:</h3>

        <div>
          {dataIsSet &&
            <ResponsiveContainer width="50%" height={200}>
              <LineChart data={chartDataPoints}>
                <Line type="monotone" dataKey="price" stroke="#666"></Line>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis name="Price"/>
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          }

          {dataIsSet && longestDownwardTrend.duration === 0 &&
            <div>
              There was no downward trend.
            </div>
          }

          {dataIsSet && longestDownwardTrend.duration > 0 && 
            <div>
              The longest downward trend was from
              <b> {longestDownwardTrend.startDate.slice(0, 10)}</b> to
              <b> {longestDownwardTrend.endDate.slice(0, 10)}</b>, total of
              <b> {longestDownwardTrend.duration}
              {(longestDownwardTrend.duration === 1 && <span> day</span>) || <span> days</span>}</b>.
            </div>
          }

          {dataIsSet && !whenToBuyAndSell.shouldBuy &&
            <div>
              One should not buy.
            </div>
          }

          {dataIsSet && whenToBuyAndSell.shouldBuy &&
            <div>
              <div>
                One should buy at
                <b> {whenToBuyAndSell.buyDate.slice(0, 10)}</b> for the price of
                <b> {whenToBuyAndSell.buyPrice} {currencyTo} per {currencyFrom}</b>.
              </div>
              <div>
                One should sell at
                  <b> {whenToBuyAndSell.sellDate.slice(0, 10)}</b> for the price of
                  <b> {whenToBuyAndSell.sellPrice} {currencyTo} per {currencyFrom}</b>.
                </div>
            </div>
          }

        </div>
      </div>

      <div>
        <h3>Trading volume:</h3>

        <div>
          {dataIsSet &&
            <ResponsiveContainer width="50%" height={200}>
              <LineChart data={chartDataPoints}>
                <Line type="monotone" dataKey="total_volume" stroke="#666"></Line>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis name="TYotal Volume"/>
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          }

          {dataIsSet &&
            <div>
              The highest trading volume was at
              <b> {highestTradingVolume.date}</b>, when the total trading volume was
              <b> {highestTradingVolume.volume}</b>.
            </div>
          }

        </div>
      </div>
      
    </div>
  );
}