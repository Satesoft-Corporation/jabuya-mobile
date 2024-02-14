import { View, Text } from "react-native";
import React from "react";
import MaterialButton from "../MaterialButton";
import Colors from "../../constants/Colors";
import { TouchableOpacity } from "react-native";

const OutlinedButton = ({
  onPress,
  title,
  disabled = false,
  titleStyle = {},
  style,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.light,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: Colors.dark,
          height: 40,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          {
            fontSize: 14,
            fontWeight: "bold",
            color: Colors.dark,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OutlinedButton;
