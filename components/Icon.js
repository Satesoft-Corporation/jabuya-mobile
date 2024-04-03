import { TouchableOpacity, Image, View, Text } from "react-native";
import React from "react";

import Colors from "../constants/Colors";

import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function Icon({ icon, containerStyle, onPress, iconStyle, titleStyle }) {
  return (
    <TouchableOpacity
      key={icon.id}
      activeOpacity={0.8}
      style={{
        flex: 1,
        alignItems: "center",
        marginVertical: 2,
        paddingVertical: 5,
        backgroundColor: Colors.light,
        margin: 10,
        marginBottom: 10,
        borderRadius: 5,
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

export const IconsComponent = ({ clear }) => {
  let color = Colors.gray;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="credit-card" size={25} color={color} />
        <Text style={{ alignSelf: "center", color }}>Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="mobile" size={25} color={color} />
        <Text style={{ alignSelf: "center", color }}>Mobile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="wechat" size={25} color={color} />
        <Text style={{ alignSelf: "center", color }}>Fap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <MaterialCommunityIcons
          name="hand-extended-outline"
          size={24}
          color={color}
        />
        <Text style={{ alignSelf: "center", color }}>Credit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.primary,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <MaterialCommunityIcons
          name="broom"
          size={25}
          color="black"
          onPress={() => {
            clear();
          }}
        />
        <Text style={{ alignSelf: "center" }}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};
