import { View, Text } from "react-native";
import React, { memo } from "react";

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
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 2,
        },
        style,
      ]}
    >
      <Text style={[{ fontWeight: 400, fontSize: 12 }, labelTextStyle]}>
        {label}
      </Text>
      <Text style={[{ fontWeight: 600, fontSize: 12 }, valueTextStyle]}>
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
