import { View, Text } from "react-native";
import React from "react";
import RenderCurrency from "../RenderCurrency";

const DataColumn = ({
  title,
  value,
  value2,
  flex = 1,
  isCurrency = false,
  left = false,
  end = false,
}) => {
  const align = left ? "left" : end ? "flex-end" : "center";

  return (
    <View style={{ alignItems: align, flex: flex }}>
      <Text
        style={{
          fontWeight: 600,
          marginBottom: 3,
          fontSize: 13,
        }}
      >
        {title}
      </Text>
      {isCurrency ? (
        <RenderCurrency value={value} />
      ) : (
        <Text style={{ fontSize: 13, fontWeight: 400 }}>{value}</Text>
      )}

      {value2 && <Text style={{ fontSize: 13, fontWeight: 400 }}>{value2}</Text>}
    </View>
  );
};

export default DataColumn;
