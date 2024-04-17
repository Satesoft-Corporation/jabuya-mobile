import { View, Text } from "react-native";
import React from "react";

const DataRow = ({
  label,
  value,
  labelTextStyle,
  valueTextStyle,
  showCurrency = false,
  currencySize = 12,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 2,
      }}
    >
      <Text style={[{ fontWeight: 400, fontSize: 12 }, labelTextStyle]}>
        {label}:
      </Text>
      <Text style={[{ fontWeight: 300, fontSize: 12 }, valueTextStyle]}>
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

export default DataRow;
