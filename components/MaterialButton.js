import React from "react";
import { Text, TouchableOpacity } from "react-native";

function MaterialButton({
  buttonPress,
  title,
  style,
  titleStyle = {},
  disabled = false,
}) {
  return (
    <TouchableOpacity
    disabled={disabled}
      style={[
        {
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        },
        style,
      ]}
      onPress={buttonPress}
    >
      <Text
        style={[
          {
            fontSize: 14,
            fontWeight: "bold",
            color:
              style.backgroundColor === "white" ||
              style.backgroundColor === "transparent"
                ? "black"
                : "white",
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default MaterialButton;
