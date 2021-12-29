import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    <View style={{flexDirection: "column", flex: 1, padding: "16px"}}>

      <View style={{flex: 1, padding: "8px"}}>
        <Text>
          {serverStatus}
        </Text>
      </View>


      <View style={{flexDirection: "row", padding: "8px"}}>

        {/* Form */}
        <View style={{flex: 1}}>
          <form onSubmit={Submit}>
            <View style={{flexDirection: "column", flex: 1}}>
              <View style={{flex: 1, margin: "8px"}}>
                <Text>Start date: </Text>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
              </View>
              
              <View style={{flex: 1, margin: "8px"}}>
                <Text>End date: </Text>
                <input type="date" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} />
                {/* <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} /> */}
              </View>

              <View style={{flex: 1, margin: "8px"}}>
                <Text>Currency from: <br /></Text>
                <select value={currencyFrom} onChange={(e) => setCurrencyFrom(e.target.value)}>
                  {currenciesFromOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
                </select>
              </View>

              <View style={{flex: 1, margin: "8px"}}>
                <Text>Currency to: <br /></Text>
                <select value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value)}>
                  {currenciesToOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
                </select>
              </View>
            </View>

            <View style={{flex: 1, margin: "8px"}}>
              <input type="submit"></input>
            </View>
          </form>
        </View>


       {/* Outputs */}
        <View style={{flexDirection: "column", flex: 4}}>
          <View style={{flex: 1, margin: "16px"}}>
            <Text><h3>Trend and when to buy & sell:</h3></Text>

            {dataIsSet &&
              <ResponsiveContainer width="75%" height={200}>
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
              <View>
                <Text>
                  There was no downward trend.
                </Text>
              </View>
            }

            {dataIsSet && longestDownwardTrend.duration > 0 && 
              <View>
                <Text>
                  The longest downward trend was from
                  <b> {longestDownwardTrend.startDate.slice(0, 10)}</b> to
                  <b> {longestDownwardTrend.endDate.slice(0, 10)}</b>, total of
                  <b> {longestDownwardTrend.duration}
                  {(longestDownwardTrend.duration === 1 && <span> day</span>) || <span> days</span>}</b>.
                </Text>
              </View>
            }

            {dataIsSet && !whenToBuyAndSell.shouldBuy &&
              <View>
                <Text>
                  One should not buy.
                </Text>
              </View>
            }

            {dataIsSet && whenToBuyAndSell.shouldBuy &&
              <View>
                <Text>
                  One should buy at
                  <b> {whenToBuyAndSell.buyDate.slice(0, 10)}</b> for the price of
                  <b> {whenToBuyAndSell.buyPrice} {currencyTo} per {currencyFrom}</b>.
                </Text>
                <Text>
                  One should sell at
                  <b> {whenToBuyAndSell.sellDate.slice(0, 10)}</b> for the price of
                  <b> {whenToBuyAndSell.sellPrice} {currencyTo} per {currencyFrom}</b>.
                </Text>
              </View>
            }
          </View>


          <View style={{flex: 1, margin: "16px"}}>
            <Text><h3>Trading volume:</h3></Text>

            <View>
              {dataIsSet &&
                <ResponsiveContainer width="75%" height={200}>
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
                <Text>
                  The highest trading volume was at
                  <b> {highestTradingVolume.date}</b>, when the total trading volume was
                  <b> {highestTradingVolume.volume}</b>.
                </Text>
              }

            </View>
          </View>
        </View>
      </View>
    </View>
  );
}