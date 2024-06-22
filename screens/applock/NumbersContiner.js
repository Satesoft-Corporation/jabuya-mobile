import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import Colors from "../../constants/Colors";
import Icon from "../../components/Icon";

const NumbersContiner = ({ onPress, fpAuth, showFpIcon = false }) => {
  const [hasFP, setHasFp] = useState(false);

  let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, <></>, 0, true];

  const handlePress = (item) => {
    const isBool = typeof item === "boolean";
    const isNum = typeof item === "number";

    if (isNum) {
      onPress(item);
    }
    if (isBool && showFpIcon === true) {
      fpAuth();
    }
  };

  const checkHardWareState = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (isAvailable === true && isEnrolled === true) {
      setHasFp(true);
    }
  };

  useEffect(() => {
    checkHardWareState();
  }, []);
  return (
    <View
      style={{
        alignItems: "center",
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
          const isNum = typeof item === "number";
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePress(item)}
              style={{
                width: 70,
                height: 70,
                borderRadius: 75,
                backgroundColor: !isNum ? Colors.dark : Colors.light,
                justifyContent: "center",
                alignItems: "center",
                margin: 8,
              }}
            >
              {!isNum && item === true ? (
                hasFP &&
                showFpIcon && <Icon name="fingerprint" color="#fff" size={30} />
              ) : (
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
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default NumbersContiner;
