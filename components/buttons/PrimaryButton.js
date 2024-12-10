import { Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@constants/Colors";

const PrimaryButton = ({ onPress, title, disabled = false, titleStyle = {}, style, darkMode = true, width, round = false }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? Colors.dark : Colors.light,
          borderRadius: round ? 20 : 5,
          borderWidth: darkMode ? 0 : 1,
          borderColor: Colors.dark,
          height: 35,
          minWidth: 100,
          width: "100%",
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          {
            fontWeight: "500",
            color: darkMode ? Colors.primary : Colors.dark,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
