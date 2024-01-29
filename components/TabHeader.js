import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Colors from "../constants/Colors";

function TabHeader({
  titles = [],
  icons = [],
  bgColor = Colors.dark,
  stripColor = Colors.primary,
  selected,
  setSelected,
  onTabPress,
  defaultTitleColor = "white",
  activeTitleColor = Colors.primary,
}) {
  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  if (titles.length > 0) {
    return (
      <View style={{ flexDirection: "row", backgroundColor: bgColor }}>
        {titles.map((t, i) => (
          <TabTextItem
            key={t}
            title={t}
            stripColor={stripColor}
            defaultTitleColor={defaultTitleColor}
            activeTitleColor={activeTitleColor}
            selected={titles.indexOf(t) === selected}
            onPress={() => onTabPress(i)}
          />
        ))}
      </View>
    );
  } else {
    return <Text>Incorrect params</Text>;
  }
}

function TabTextItem({
  title,
  selected = false,
  onPress,
  stripColor,
  defaultTitleColor,
  activeTitleColor,
}) {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: selected ? stripColor : "transparent",
        opacity: selected ? 1 : 0.6,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: selected ? activeTitleColor : defaultTitleColor,
          paddingBottom: 8,
          paddingTop: 8,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default TabHeader;
