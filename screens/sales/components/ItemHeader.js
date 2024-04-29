import { View, Text } from "react-native";
import React, { memo } from "react";
import Colors from "../../../constants/Colors";

const ItemHeader = ({ title, value, ugx = true }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          fontSize: 12,
          color: Colors.primary,
          alignSelf: "flex-start",
          opacity: 0.6,
          marginBottom: 3,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontSize: 15, color: Colors.primary, fontWeight: "bold" }}>
        {ugx && (
          <Text
            style={{
              fontSize: 10,
            }}
          >
            UGX
          </Text>
        )}{" "}
        {value}
      </Text>
    </View>
  );
};

export default memo(ItemHeader);
