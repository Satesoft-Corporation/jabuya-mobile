import { View, Text } from "react-native";
import React from "react";

const DataRow = ({
  label,
  value,
  labelTextStyle,
  valueTextStyle,
  currency,
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
      <Text style={[{ fontWeight: 400, fontSize: 14 }, labelTextStyle]}>
        {label}
      </Text>
      <Text style={[{ fontWeight: 600, fontSize: 14 }, valueTextStyle]}>
        {currency && (
          <Text
            style={{
              fontSize: 10,
            }}
          >
            {currency}{" "}
          </Text>
        )}
        {value}
      </Text>
    </View>
  );
};

export default DataRow;
