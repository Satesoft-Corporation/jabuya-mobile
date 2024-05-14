import { View, Text } from "react-native";
import React, { memo } from "react";
import RenderCurrency from "../RenderCurrency";

const DataRow = ({
  label,
  value,
  labelTextStyle,
  valueTextStyle,
  showCurrency = false,
  currencySize = 8,
  style,
}) => {
  return (
    <View
      key={label}
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 2,
        },
        style,
      ]}
    >
      <Text style={[{ fontWeight: 600, fontSize: 14 }, labelTextStyle]}>
        {label}
      </Text>
      <Text style={[{ fontWeight: 600, fontSize: 14 }, valueTextStyle]}>
        {showCurrency && (
          <Text
            style={{
              fontSize: currencySize,
            }}
          >
            UGX{" "}
          </Text>
        )}
        {value}
      </Text>
    </View>
  );
};

export default memo(DataRow);
