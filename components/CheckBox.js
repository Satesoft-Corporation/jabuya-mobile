import { View, TouchableOpacity, Text } from "react-native";
import React from "react";

const CheckBox = ({ isChecked = false, onPress, label = "" }) => {
  return (
    <TouchableOpacity style={{ gap: 5, flexDirection: "row", alignItems: "center" }} onPress={onPress}>
      <View style={{ width: 18, height: 18, borderColor: "#000", borderWidth: 1, borderRadius: 100, justifyContent: "space-around" }}>
        <View style={{ flex: 1, margin: 2, backgroundColor: isChecked ? "#000" : "transparent", borderRadius: 100 }} />
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
