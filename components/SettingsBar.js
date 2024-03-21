import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import Colors from "../constants/Colors";

const SettingsBar = ({
  icon = "",
  text = "",
  onPress = () => {},
  tintColor = Colors.dark,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingBottom: 10,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 50,
            marginStart: 5,
            borderWidth: 1,
            borderColor: Colors.dark,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={icon}
            style={{
              width: 25,
              height: 25,
              resizeMode: "cover",
              tintColor: Colors.dark,
            }}
          />
        </View>

        <View
          style={{
            marginHorizontal: 5,
          }}
        >
          <Text
            style={{
              fontWeight: 400,
              // fontSize: 12,
            }}
          >
            {text}
          </Text>
        </View>
      </View>

      <Image
        source={require("../assets/icons/icons8-right-arrow-50.png")}
        style={{
          width: 15,
          height: 15,
          resizeMode: "cover",
          alignSelf: "center",
          justifyContent: "center",
          tintColor: Colors.dark,
        }}
      />
    </TouchableOpacity>
  );
};

export default SettingsBar;
