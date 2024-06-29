import { View, Text } from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";

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
          marginVertical: 3,
        },
        style,
      ]}
    >
      <Text style={[{ fontWeight: 400, fontSize: scale(14) }, labelTextStyle]}>
        {label}
      </Text>
      <Text
        style={[
          { fontWeight: 600, fontSize: scale(14), flex: 1, textAlign: "right" },
          valueTextStyle,
        ]}
        numberOfLines={2}
      >
        {currency && (
          <Text
            style={{
              fontSize: scale(10),
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
