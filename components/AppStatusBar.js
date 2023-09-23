import { StatusBar } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

export default function AppStatusBar({
  translucent = false,
  bgColor = Colors.primary,
  content = "dark-content",
}) {
  return (
    <StatusBar
      translucent={translucent}
      backgroundColor={bgColor}
      barStyle={content}
    />
  );
}
