import { View, Text } from "react-native";
import React from "react";
import MaterialButton from "../MaterialButton";
import Colors from "../../constants/Colors";
import { TouchableOpacity } from "react-native";

const PrimaryButton = ({
  onPress,
  title,
  disabled = false,
  titleStyle = {},
  style,
  darkMode = true,
  width,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? Colors.dark : Colors.light,
          borderRadius: 5,
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
            fontWeight: "bold",
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
