import { TouchableOpacity, Image, View, Text } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

export default function ({ icon, containerStyle, onPress, iconStyle, titleStyle }) {
  return (
    <TouchableOpacity
      key={icon.id}
      activeOpacity={0.8}
      style={{
        flex: 1,
        alignItems: "center",
        marginVertical: 2,
        paddingVertical: 5,
        backgroundColor:Colors.light,
        margin:10,
        marginBottom:10

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
              tintColor:Colors.dark
            },
            iconStyle,
          ]}
        />
      </View>
      <Text
        style={[
          {
            color: Colors.dark,
            fontSize: 15,
            margin: 10,
            fontWeight: "500",
            
          },
          titleStyle,
        ]}
      >
        {icon.title}
      </Text>
    </TouchableOpacity>
  );
}
