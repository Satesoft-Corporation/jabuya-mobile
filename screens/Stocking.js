import { View, Text } from "react-native";
import React from "react";
import StockingIcon from "../components/StockingIcon";
import Colors from "../constants/Colors";
import { FlatList } from "react-native";
import TopHeader from "../components/TopHeader";
import AppStatusBar from "../components/AppStatusBar";

const Stocking = ({ navigation }) => {
  let list = [
    {
      title: "Stock purchases",
      target: "stockPurchase",
    },
    {
      title: "Make a purchase",
      target: "stockPurchaseForm",
    },
    {
      title: "Stock Listing",
      target: "stockListing",
    },
    {
      title: "Add new product",
    },
    {
      title: "Stock levels",
      target: "stockLevels",
    },
  ];

  const onPress = (item) => {
    if (item.target) {
      navigation.navigate(item?.target);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar content="light-content" bgColor="black" />

      <TopHeader title="Stocking" onBackPress={() => navigation.goBack()} />
      <FlatList
        style={{ flex: 1, marginTop: 10, paddingHorizontal: 10 }}
        data={list}
        renderItem={({ item }) => (
          <StockingIcon disabled={!item.target} title={item.title} onPress={() => onPress(item)} />
        )}
        numColumns={2}
      />
    </View>
  );
};

export default Stocking;
