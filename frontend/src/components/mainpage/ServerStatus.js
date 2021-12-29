import React from "react";
import { Text } from "react-native";

export const ComponentServerStatus = (props) => {
  return (
    <Text>
      {props.serverStatus}
    </Text>
  );
}