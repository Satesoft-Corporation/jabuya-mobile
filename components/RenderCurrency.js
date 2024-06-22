import { Text } from "react-native";
import React from "react";
import { formatNumberWithCommas } from "../utils/Utils";
import Colors from "../constants/Colors";

const RenderCurrency = ({ value = 0, color = Colors.dark }) => {
  return (
    <Text style={{ fontSize: 14, color: color }}>
      <Text style={{ fontSize: 8, fontWeight: 400 }}>UGX </Text>
      {Number(value) < 0
        ? `(${formatNumberWithCommas(Math.abs(value))})`
        : formatNumberWithCommas(value)}
    </Text>
  );
};

export default RenderCurrency;
