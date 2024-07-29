import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "@constants/Colors";

const EntryBar = ({ title, target }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate(target)}
      style={{
        backgroundColor: "#303030", //121111
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginVertical: 5,
      }}
    >
      <Text
        style={{
          color: Colors.primary,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          borderRadius: 50,
          backgroundColor: Colors.dark,
          // padding: 10,
          height: 25,
          width: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/icons/icons8-right-arrow-50.png")}
          style={{
            height: 10,
            width: 10,
            resizeMode: "contain",
            tintColor: Colors.primary,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default EntryBar;
