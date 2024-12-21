import Colors from "@constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as Icons from "react-native-vector-icons"; // Correct wildcard import

export default function Icon({ groupName = "FontAwesome5", name = "question", color, size = 15, style, borderd = false, ...props }) {
  const SelectedIcon = Icons[groupName]; // Dynamically select icon group
  if (!SelectedIcon) {
    console.error(`Icon group "${groupName}" not found. Check the group name.`);
    return null;
  }
  if (borderd) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.light,
          borderRadius: 3,
          borderWidth: 1,
          width: 35,
          height: 27,
        }}
      >
        <SelectedIcon name={name} style={StyleSheet.flatten([style])} {...props} color={color} size={size} />
      </View>
    );
  }

  return <SelectedIcon name={name} style={StyleSheet.flatten([style])} {...props} color={color} size={size} />;
}
