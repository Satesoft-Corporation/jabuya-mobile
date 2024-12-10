import React from "react";
import { StyleSheet } from "react-native";
import * as Icons from "react-native-vector-icons"; // Correct wildcard import

export default function Icon({ groupName = "FontAwesome5", name = "question", color, size = 15, style, ...props }) {
  const SelectedIcon = Icons[groupName]; // Dynamically select icon group
  if (!SelectedIcon) {
    console.error(`Icon group "${groupName}" not found. Check the group name.`);
    return null;
  }

  return <SelectedIcon name={name} style={StyleSheet.flatten([style])} {...props} color={color} size={size} />;
}
