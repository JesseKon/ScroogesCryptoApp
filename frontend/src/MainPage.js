import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { currenciesOptions, vsCurrenciesOptions } from "./helpers/Currencies";
import { GetChartDataPoints } from "./helpers/ChartDataPoints";
import { GetLongestDownwardTrend } from "./helpers/DownwardTrend";
import { GetHighestTradingVolume } from "./helpers/TradingVolume";
import { GetWhenToBuyAndSell } from "./helpers/WhenToBuyAndSell";

import { ComponentServerStatus } from "./components/mainpage/ServerStatus";
import { ComponentTrend } from "./components/mainpage/Trend";
import { ComponentTradingVolume } from "./components/mainpage/TradingVolume";


export const MainPage = () => {
  const [serverStatus, setServerStatus] = useState("Waiting server status...");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currency, setCurrency] = useState(currenciesOptions[0].value);
  const [vsCurrency, setVsCurrency] = useState(vsCurrenciesOptions[0].value);

  const [chartDataPoints, setChartDataPoints] = useState({});
  const [longestDownwardTrend, setLongestDownwardTrend] = useState({});
  const [highestTradingVolume, setHighestTradingVolume] = useState({});
  const [whenToBuyAndSell, setWhenToBuyAndSell] = useState({});
  const [showResults, setShowResults] = useState(false);


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
        currency: currency,
        vsCurrency: vsCurrency
      })
    };

    const response = await fetch("http://localhost:8000/api/getData", request);
    const data = await response.json();

    setChartDataPoints(GetChartDataPoints(data));
    setLongestDownwardTrend(GetLongestDownwardTrend(data));
    setHighestTradingVolume(GetHighestTradingVolume(data));
    setWhenToBuyAndSell(GetWhenToBuyAndSell(data));
    setShowResults(data[0] !== undefined); // Show results only if we have something to show
  }


  return (
    <View style={{flexDirection: "column", flex: 1, padding: "16px"}}>

      {/* Server status */}
      <View style={{flex: 1, margin: "8px"}}>
        <ComponentServerStatus serverStatus={serverStatus} />
      </View>

      <View style={{flexDirection: "row", padding: "8px"}}>

        {/* Form */}
        <View style={{flex: 1}}>
          <form onSubmit={Submit}>
            <View style={{flexDirection: "column", flex: 1}}>
              <View style={{flex: 1, margin: "8px"}}>
                <Text>Start date: </Text>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </View>
              
              <View style={{flex: 1, margin: "8px"}}>
                <Text>End date: </Text>
                <input type="date" defaultValue={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </View>

              <View style={{flex: 1, margin: "8px"}}>
                <Text>Currency: <br /></Text>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {currenciesOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
                </select>
              </View>

              <View style={{flex: 1, margin: "8px"}}>
                <Text>Vs currency: <br /></Text>
                <select value={vsCurrency} onChange={(e) => setVsCurrency(e.target.value)}>
                  {vsCurrenciesOptions.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
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
          <ComponentTrend
            showResults={showResults}
            chartDataPoints={chartDataPoints}
            longestDownwardTrend={longestDownwardTrend}
            whenToBuyAndSell={whenToBuyAndSell}
            currency={currency}
            vsCurrency={vsCurrency}
          />
          <ComponentTradingVolume
            showResults={showResults}
            chartDataPoints={chartDataPoints}
            highestTradingVolume={highestTradingVolume}
          />
        </View>

      </View>
    </View>
  );
}