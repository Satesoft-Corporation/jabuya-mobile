import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";

const TopHeader = ({
  title = "Details",
  onPress,
  showSave = false,
  onSave,
  onBackPress,
  showSearch = false,
  toggleSearch,
}) => {
  return (
    <View
      style={{
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        backgroundColor: Colors.dark,
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("../assets/icons/icons8-chevron-left-30.png")}
          style={{
            height: 30,
            width: 20,
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          minWidth: 30,
        }}
      >
        {showSearch && (
          <TouchableOpacity onPress={toggleSearch}>
            <Image
              source={require("../assets/icons/ic_search_gray.png")}
              style={{
                height: 30,
                width: 20,
                resizeMode: "contain",
                tintColor: Colors.primary,
              }}
            />
          </TouchableOpacity>
        )}

        {showSave && (
          <TouchableOpacity onPress={onSave}>
            <Image
              source={require("../assets/icons/icons8-done-50.png")}
              style={{
                height: 35,
                width: 25,
                resizeMode: "contain",
                tintColor: Colors.primary,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TopHeader;
