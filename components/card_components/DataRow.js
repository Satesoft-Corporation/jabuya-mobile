import { View, Text } from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";

const DataRow = ({ label, value, style }) => {
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
      <Text style={[{ fontWeight: 400, fontSize: scale(14) }]}>{label}</Text>
      <Text style={[{ fontWeight: 600, fontSize: scale(13) }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
};

export default DataRow;
