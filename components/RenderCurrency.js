import { Text } from "react-native";
import React from "react";
import { formatNumberWithCommas } from "@utils/Utils";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const RenderCurrency = ({
  value = 0,
  color = Colors.dark,
  currencySymbol = "",
}) => {
  return (
    <Text
      style={{
        fontSize: scale(13),
        color: color,
        flexDirection: "row",
        gap: 2,
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: scale(11), fontWeight: 400 }}>
        {currencySymbol}{" "}
      </Text>
      {Number(value) < 0
        ? `(${formatNumberWithCommas(Math.abs(value))})`
        : formatNumberWithCommas(value)}
    </Text>
  );
};

export default RenderCurrency;
