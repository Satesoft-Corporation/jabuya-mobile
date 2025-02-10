import { TouchableOpacity, Image, View, Text } from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";
import Colors from "@constants/Colors";

export function MenuIcon({ icon, containerStyle, onPress, iconStyle, titleStyle }) {
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
        width: 200,
        justifyContent: "center",
        paddingVertical: 10,
        gap: 10,
      }}
      onPress={onPress}
    >
      <View
        key={icon.id}
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          },
        ]}
      >
        <Image source={icon.icon} tintColor={Colors.dark} style={[{ width: 35, height: 35 }]} />
      </View>
      <Text style={[{ color: Colors.dark, fontSize: scale(14), fontWeight: "500", textAlign: "center" }]}>{icon.title}</Text>
    </TouchableOpacity>
  );
}
