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
        backgroundColor: Colors.light_2, //121111
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        minHeight: 40,
        borderBottomColor: "#000",
        borderBottomWidth: isLast ? 0 : 0.5,
        padding: 15,
        borderRadius: 5,
      }}
    >
      <Icon name={icon} size={18} />
      <Text style={{}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default EntryBar;
