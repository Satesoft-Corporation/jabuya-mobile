import { View, Text } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const ItemHeader = ({ title, value }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 3 }}>
      <Text style={{ fontSize: 12, color: Colors.primary, alignSelf: "center", opacity: 0.6 }}>{title}</Text>

      <Text style={{ fontSize: scale(13), color: Colors.primary }}>{value}</Text>
    </View>
  );
};

export default ItemHeader;
