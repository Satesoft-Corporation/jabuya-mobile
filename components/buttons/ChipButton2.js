import { Text, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import Colors from "../../constants/Colors";

const ChipButton2 = ({ onPress, title = "", darkMode = true }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: darkMode ? Colors.dark : Colors.light,
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

export default memo(ChipButton2);
