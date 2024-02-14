import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

const TopHeader = ({ title = "Details", onPress }) => {
  return (
    <View
      style={{
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        backgroundColor: Colors.dark,
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("../assets/icons/ic_close.png")}
          style={{
            height: 20,
            width: 12,
            resizeMode: "contain",
            tintColor: Colors.primary,
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          color: Colors.primary,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <View style={{ width: 12 }} />
    </View>
  );
};

export default TopHeader;
