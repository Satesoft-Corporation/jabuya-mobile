import { Text } from "react-native";
import React from "react";
import { formatNumberWithCommas } from "../utils/Utils";

const RenderCurrency = ({ value }) => {
  return (
    <Text style={{ fontSize: 13 }}>
      <Text style={{ fontSize: 8, fontWeight: 400 }}>UGX </Text>
      {Number(value) < 0
        ? `(${formatNumberWithCommas(Math.abs(value))})`
        : formatNumberWithCommas(value)}
    </Text>
  );
};

export default RenderCurrency;
