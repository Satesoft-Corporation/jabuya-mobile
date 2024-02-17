import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

const CurrentShop = () => {
  let opacity = 0.7;
  return (
    <View
      style={{
        backgroundColor: Colors.dark,
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 5,
      }}
    >
      <Image
        source={require("../assets/icons/icons8-store-50.png")}
        style={{
          height: 20,
          width: 20,
          resizeMode: "contain",
          tintColor: Colors.primary,
          opacity,
        }}
      />

      <Text
        style={{
          color: Colors.primary,
          fontSize: 15,
          opacity,
        }}
      >
        Moses Test Shop
      </Text>
    </View>
  );
};

export default CurrentShop;
