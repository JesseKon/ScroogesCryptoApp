import React from "react";
import { View, Text } from "react-native";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export const ComponentTradingVolume = (props) => {
  return (
    <View style={{flex: 1, margin: "16px"}}>
      <Text><h3>Trading volume:</h3></Text>

      <View>
        {props.showResults &&
          <ResponsiveContainer width="75%" height={200}>
            <LineChart data={props.chartDataPoints}>
              <Line type="monotone" dataKey="total_volume" stroke="#666"></Line>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis name="Total volume"/>
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        }

        {props.showResults &&
          <Text>
            The highest trading volume was on
            <b> {props.highestTradingVolume.date}</b>, when the total trading volume was
            <b> {props.highestTradingVolume.volume}</b>.
          </Text>
        }

      </View>
    </View>
  );
}