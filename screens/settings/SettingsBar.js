import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import Colors from "../../constants/Colors";

const SettingsBar = ({ icon, text = "", onPress = () => {}, renderRight = () => {}, style, textColor = Colors.dark, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 40,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {icon}

        <Text
          style={[
            {
              fontWeight: 400,
              color: textColor,
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      </View>

      {renderRight()}
    </TouchableOpacity>
  );
};

export default SettingsBar;
