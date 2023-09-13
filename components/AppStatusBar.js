import { StatusBar } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

export default function AppStatusBar({
  translucent = false,
  bgColor = Colors.primary,
}) {
  return <StatusBar translucent={translucent} backgroundColor={bgColor} barStyle="dark-content"/>;
}
