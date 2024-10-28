import { Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const PrimaryButton = ({
  onPress,
  title,
  disabled = false,
  titleStyle = {},
  style,
  darkMode = true,
  width,
  round = false,
}) => {
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
          height: 40,
          minWidth: 100,
          width,
          flex: 1,
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
            fontSize: scale(15),
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
