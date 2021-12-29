import React from "react";
import { View, Text } from "react-native";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const ComponentTrend = (props) => {
  return (
    <View style={{flex: 1, margin: "16px"}}>
      <Text><h3>Trend and when to buy & sell:</h3></Text>

      {props.showResults &&
        <ResponsiveContainer width="75%" height={200}>
          <LineChart data={props.chartDataPoints}>
            <Line type="monotone" dataKey="price" stroke="#666"></Line>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis name="Price"/>
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      }

      {props.showResults && props.longestDownwardTrend.duration === 0 &&
        <View>
          <Text>
            There was no downward trend between 
            <b> {props.longestDownwardTrend.startDate}</b> and
            <b> {props.longestDownwardTrend.endDate}</b>.
          </Text>
        </View>
      }

      {props.showResults && props.longestDownwardTrend.duration > 0 && 
        <View>
          <Text>
            The longest downward trend was from
            <b> {props.longestDownwardTrend.startDate}</b> to
            <b> {props.longestDownwardTrend.endDate}</b>, total of
            <b> {props.longestDownwardTrend.duration}
            {(props.longestDownwardTrend.duration === 1 && <span> day</span>) || <span> days</span>}</b>.
          </Text>
        </View>
      }

      {props.showResults && !props.whenToBuyAndSell.shouldBuy &&
        <View>
          <Text>
            One should not buy.
          </Text>
        </View>
      }

      {props.showResults && props.whenToBuyAndSell.shouldBuy &&
        <View>
          <Text>
            One should buy on
            <b> {props.whenToBuyAndSell.buyDate.slice(0, 10)}</b> for the price of
            <b> {props.whenToBuyAndSell.buyPrice} {props.vsCurrency} per {props.currency}</b>.
          </Text>
          <Text>
            One should sell on
            <b> {props.whenToBuyAndSell.sellDate.slice(0, 10)}</b> for the price of
            <b> {props.whenToBuyAndSell.sellPrice} {props.vsCurrency} per {props.currency}</b>.
          </Text>
        </View>
      }
    </View>
  );
}
