import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Colors from "@constants/Colors";
import Icon from "./Icon";
const EntryBar = ({ title, target, isLast = false, icon = "" }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate(target)}
      style={{
        backgroundColor: Colors.light_2,
        borderBottomColor: "#000",
        borderRadius: 5,
        gap: 15,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingTop: 10,
        // paddingBottom: 2,
        minHeight: 45,
      }}
    >
      <View
        style={{
          paddingBottom: 15,
        }}
      >
        <Icon name={icon} size={20} />
      </View>
      <View
        style={{
          borderBottomColor: "#000",
          borderBottomWidth: !isLast ? 0.5 : 0,
          flex: 1,
          paddingBottom: 15,
        }}
      >
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EntryBar;
