import { View, Text } from "react-native";
import React, { memo } from "react";
import Colors from "../../../constants/Colors";
import RenderCurrency from "../../../components/RenderCurrency";

const ItemHeader = ({ title, value, isCurrency = false }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 3 }}>
      <Text
        style={{
          fontSize: 12,
          color: Colors.primary,
          alignSelf: "center",
          opacity: 0.6,
        }}
      >
        {title}
      </Text>
      {isCurrency ? (
        <RenderCurrency value={value} color={Colors.primary} />
      ) : (
        <Text style={{ fontSize: 14, color: Colors.primary }}>{value}</Text>
      )}
    </View>
  );
};

export default memo(ItemHeader);
