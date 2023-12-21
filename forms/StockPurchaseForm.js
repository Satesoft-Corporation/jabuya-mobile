import { View, Text } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";

const StockPurchaseForm = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <Text>StockPurchaseForm</Text>
    </View>
  );
};

export default StockPurchaseForm;
