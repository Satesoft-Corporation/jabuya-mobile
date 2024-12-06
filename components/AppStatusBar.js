import { StatusBar } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

export default function AppStatusBar({ mode = "dark" }) {
  let barStyle = mode === "dark" ? "light-content" : "dark-content";
  let bgColor = mode === "dark" ? Colors.dark : Colors.primary;

  return <StatusBar translucent={false} backgroundColor={bgColor} barStyle={barStyle} />;
}
