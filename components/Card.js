import React from "react";
import { View } from "react-native";

export default function Card({ children, style }) {
  return (
    <View
      style={[
        {
          borderRadius: 12,
          minHeight: 100,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
