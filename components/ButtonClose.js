import React from "react";
import { TouchableOpacity, Image } from "react-native";
import Colors from "../constants/Colors";

function ButtonClose({ onClose }) {
  return (
    <TouchableOpacity
      onPress={onClose}
      style={{
        position: "absolute",
        right: 10,
        top: 10,
        height: 33,
        width: 33,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        style={{ width: 15, height: 15, tintColor: Colors.gray }}
        source={require("../assets/icons/ic_close.png")}
      />
    </TouchableOpacity>
  );
}

export default ButtonClose