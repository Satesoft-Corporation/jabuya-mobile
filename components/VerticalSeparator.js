import { View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

const VerticalSeparator = () => {
  return (
    <View
      style={{
        width: 1,
        height: "inherit",
        backgroundColor: Colors.primary,
      }}
    />
  );
};

export default VerticalSeparator;
