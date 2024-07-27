import { TouchableOpacity, Image, View, Text } from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";
import Colors from "@constants/Colors";

export function MenuIcon({
  icon,
  containerStyle,
  onPress,
  iconStyle,
  titleStyle,
}) {
  return (
    <TouchableOpacity
      key={icon.id}
      activeOpacity={0.8}
      style={{
        flex: 1,
        alignItems: "center",
        margin: 5,
        borderRadius: 5,
        backgroundColor: Colors.light,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        padding: 5,
        width: 200,
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <View
        key={icon.id}
        style={[
          {
            height: 55,
            width: 55,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          },
          containerStyle,
        ]}
      >
        <Image
          source={icon.icon}
          style={[
            {
              width: 35,
              height: 35,
              tintColor: Colors.dark,
            },
            iconStyle,
          ]}
        />
      </View>
      <Text
        style={[
          {
            color: Colors.dark,
            fontSize: scale(14),
            margin: 10,
            fontWeight: "500",
            textAlign: "center",
          },
          titleStyle,
        ]}
      >
        {icon.title}
      </Text>
    </TouchableOpacity>
  );
}
