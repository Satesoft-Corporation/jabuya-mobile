import { View, Text } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const PinDot = ({ number }) => {
  const constants = {
    width: 15,
    height: 15,
    borderRadius: 13,
  };
  return (
    <View
      style={
        number === ""
          ? {
              ...constants,
              borderColor: Colors.light,
              borderWidth: 1,
            }
          : {
              ...constants,
              borderColor: Colors.dark,
              backgroundColor: Colors.primary,
            }
      }
    ></View>
  );
};

export default PinDot;
