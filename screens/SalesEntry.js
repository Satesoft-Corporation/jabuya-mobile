import { View, Text } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";

export default function SalesEntry() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
        paddingHorizontal: 15,
      }}
    >
      <AppStatusBar />
    </View>
  );
}
