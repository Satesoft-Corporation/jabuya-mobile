import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const ChipButton = ({ title, onPress, isSelected = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 30,
        backgroundColor: isSelected ? Colors.primary : Colors.light,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        width: 75,
        borderColor: Colors.dark,
        borderWidth: isSelected ? 0 : 1,
        margin: 5,
        marginStart: 1,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: Colors.dark,
          alignSelf: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ChipButton;
