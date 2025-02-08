import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@constants/Colors";

const PrimaryButton = ({ onPress, title, disabled = false, loaderColor, style, darkMode = false, loading = false, round = false }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? Colors.dark : Colors.light,
          borderRadius: round ? 20 : 5,
          borderWidth: darkMode ? 0 : 1,
          borderColor: Colors.dark,
          height: 35,
          minWidth: 100,
          width: "100%",
          flexDirection: "row",
          gap: 5,
        },
        style,
      ]}
      onPress={() => {
        if (loading === false) {
          onPress();
        }
      }}
    >
      {loading && <ActivityIndicator size={20} style={{ alignSelf: "center" }} color={loaderColor ?? Colors.primary} />}
      {!loading && <Text style={[{ fontWeight: "500", color: darkMode ? Colors.primary : Colors.dark }]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
