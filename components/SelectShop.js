import { View, Text } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { Image } from "react-native";

const SelectShop = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 10,
        gap: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#303030", //121111
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 5,
          padding: 5,
          flex: 4,
        }}
      >
        <Text
          style={{
            color: Colors.primary,
            fontSize: 13,
          }}
        >
          Moses Test Shop
        </Text>

        <View
          style={{
            borderRadius: 50,
            backgroundColor: Colors.dark,
            // padding: 10,
            height: 25,
            width: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/icons/icons8-right-arrow-50.png")}
            style={{
              height: 10,
              width: 10,
              resizeMode: "contain",
              tintColor: Colors.primary,
            }}
          />
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#303030",
          borderRadius: 5,
          padding: 5,
          //   height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/icons/icons8-store-50.png")}
          style={{
            height: 25,
            width: 25,
            resizeMode: "contain",
            tintColor: Colors.primary,
          }}
        />
      </View>
    </View>
  );
};

export default SelectShop;
