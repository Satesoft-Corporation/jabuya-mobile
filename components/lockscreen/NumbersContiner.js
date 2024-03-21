import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const NumbersContiner = ({ onPress }) => {
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  return (
    <View
      style={{
        alignItems: "center",
        // marginTop: 30,
      }}
    >
      <FlatList
        data={numbers}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item)}
              style={{
                width: 75,
                height: 75,
                borderRadius: 75,
                backgroundColor: Colors.gray,
                justifyContent: "center",
                alignItems: "center",
                margin: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  letterSpacing: 0,
                //   color: Colors.light,
                  textAlign: "center",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default NumbersContiner;
