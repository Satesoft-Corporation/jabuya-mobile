import React from "react";
import { View } from "react-native";
import Colors from "../constants/Colors";

export const BlackScreen = ({ children, flex = 0.18 }) => {
  return (
    <View style={{ flex: flex, backgroundColor: "black" }}>{children}</View>
  );
};

export const WhiteScreen = ({ children }) => {
  return (
    <View style={{ flex: 3, padding: 10, backgroundColor: Colors.light_2 }}>
      {children}
    </View>
  );
};
