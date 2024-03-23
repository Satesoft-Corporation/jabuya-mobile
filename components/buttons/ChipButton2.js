import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const ChipButton2 = ({ onPress, title = "", darkMode = true }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkMode ? Colors.dark : Colors.primary,
        borderRadius: 3,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: darkMode ? Colors.primary : Colors.dark,
          fontSize: 13,
          fontWeight: 300,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ChipButton2;
