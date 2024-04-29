import { View, Text } from "react-native";
import React, { memo } from "react";
import { formatNumberWithCommas } from "../utils/Utils";

const RenderCurrency = ({ value }) => {
  return (
    <Text>
      <Text style={{ fontSize: 8, fontWeight: 400 }}>UGX </Text>
      {formatNumberWithCommas(value)}
    </Text>
  );
};

export default memo(RenderCurrency);
