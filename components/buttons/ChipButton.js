import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const ChipButton = ({
  title,
  onPress,
  isSelected = false,
  darkMode = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        darkMode
          ? {
              height: 30,
              backgroundColor: Colors.dark,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              width: 80,
              borderColor: Colors.dark,
              borderWidth: 1,
              margin: 5,
              marginStart: 1,
            }
          : {
              height: 30,
              backgroundColor: isSelected ? Colors.primary : Colors.light,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4,
              width: 80,
              borderColor: isSelected ? Colors.primary : Colors.dark,
              borderWidth: 1,
              margin: 5,
              marginStart: 1,
            }
      }
    >
      <Text
        style={{
          textAlign: "center",
          color: darkMode ? Colors.primary : Colors.dark,
          alignSelf: "center",
          fontSize: 15,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ChipButton;
