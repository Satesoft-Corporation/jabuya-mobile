import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import Colors from "../../constants/Colors";

const SettingsBar = ({
  icon = "",
  text = "",
  onPress = () => {},
  tintColor = Colors.dark,
  renderRight = () => {},
  style,
  textColor = Colors.dark,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
          paddingBottom: 10,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={icon}
          style={{
            width: 25,
            height: 25,
            resizeMode: "cover",
            tintColor: tintColor,
            marginHorizontal: 5,
          }}
        />

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
