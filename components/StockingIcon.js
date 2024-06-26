import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const StockingIcon = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: Colors.light,
        borderRadius: 6,
        width: 200,
        margin: 10,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        flex: 1,
      }}
    >
      <View
        style={{
          height: 60,
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: scale(17),
            fontWeight: 600,
            marginTop: 10,
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "black",
          height: 1,
          opacity: 0.3,
        }}
      ></View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Image
          source={require("../assets/icons/icons8-file-64.png")}
          style={{
            width: 25,
            height: 25,
            resizeMode: "contain",
            marginStart: 5,
          }}
        />
        <Image
          source={require("../assets/icons/icons8-right-arrow-50.png")}
          style={{
            width: 20,
            height: 18,
            resizeMode: "contain",
            marginStart: 5,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default StockingIcon;
