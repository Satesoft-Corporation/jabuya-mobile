import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
  onSearch,
  onClear,
}) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: "#f3f3f3",
          borderRadius: 3,
          height: 35,
          marginHorizontal: 10,
          marginTop: 10,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          style={{ paddingHorizontal: 15 }}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
      <TouchableOpacity
        onPress={onSearch}
        style={{ width: 50, alignItems: "center", justifyContent: "center" }}
      >
        <Image
          source={require("../assets/icons/ic_search_gray.png")}
          style={{ width: 20, height: 20, tintColor: Colors.gray }}
        />
      </TouchableOpacity>
    </View>
  );
}
