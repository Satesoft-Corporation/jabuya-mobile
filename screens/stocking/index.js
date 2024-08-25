import { View, FlatList } from "react-native";
import React from "react";
import { STOCK_ENTRY, STOCK_LEVELS } from "@navigation/ScreenNames";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import StockingIcon from "@components/StockingIcon";

const StockingMenu = ({ navigation }) => {
  let list = [
    {
      title: "Stock purchases",
      target: STOCK_ENTRY,
    },

    {
      title: "Stock levels",
      target: STOCK_LEVELS,
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

      <TopHeader title="Stocking" />
      <FlatList
        style={{ flex: 1, marginTop: 10, paddingHorizontal: 10 }}
        data={list}
        renderItem={({ item }) => (
          <StockingIcon
            disabled={!item.target}
            title={item.title}
            onPress={() => onPress(item)}
          />
        )}
        numColumns={2}
      />
    </View>
  );
};

export default StockingMenu;
