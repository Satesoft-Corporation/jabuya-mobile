import { View, Text } from "react-native";
import React from "react";
import StockingIcon from "../components/StockingIcon";
import Colors from "../constants/Colors";
import { FlatList } from "react-native";
import TopHeader from "../components/TopHeader";
import CurrentShop from "../components/CurrentShop";
import AppStatusBar from "../components/AppStatusBar";

const Stocking2 = () => {
  let list = [
    "Stock purchases",
    "Make a purchase",
    "Stock Listing",
    "Add new product",
    "Stock levels",
  ];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar content="light-content" bgColor="black" />

      <TopHeader title="Stocking" />
      <CurrentShop />
      <FlatList
        style={{ flex: 1, marginTop: 10, paddingHorizontal: 10 }}
        data={list}
        renderItem={({ item }) => <StockingIcon title={item} />}
        numColumns={2}
      />
    </View>
  );
};

export default Stocking2;
