import React from "react";
import { StyleSheet } from "react-native";
import * as Icone from "react-native-vector-icons"; // Use wildcard import

export default function Icon(props) {
  const { style, enableRTL, groupName = "FontAwesome5", ...rest } = props; // Added iconName
  const Icon = Icone[groupName]; // Dynamically select icon based on iconName prop
  if (!Icon) {
    console.error(`Icon ${groupName} not found`);
    return null;
  }
  return <Icon style={StyleSheet.flatten([style])} {...rest} />;
}
