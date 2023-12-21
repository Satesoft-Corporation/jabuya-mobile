import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Colors from "../constants/Colors";

function TabHeader({
  titles = [],
  icons = [],
  bgColor = Colors.dark,
  stripColor = Colors.primary,
  activeIndex,
  onActiveChanged,
  defaultTitleColor = "white",
  activeTitleColor = Colors.primary,
}) {
  const [selected, setSelected] = useState(activeIndex);

  const onTabPress = (t) => {
    let activeIndex = 0;
    if (titles.length > 0) {
      activeIndex = titles.indexOf(t);
    } else if (icons.length > 0) {
      activeIndex = icons.indexOf(t);
    }
    setSelected(activeIndex);
    onActiveChanged(activeIndex);
  };

  if (titles.length > 0) {
    return (
      <View style={{ flexDirection: "row", backgroundColor: bgColor }}>
        {titles.map((t) => (
          <TabTextItem
            key={t}
            title={t}
            stripColor={stripColor}
            defaultTitleColor={defaultTitleColor}
            activeTitleColor={activeTitleColor}
            selected={titles.indexOf(t) === selected}
            onPress={() => onTabPress(t)}
          />
        ))}
      </View>
    );
  } else if (icons.length > 0) {
    return (
      <View style={{ flexDirection: "row", backgroundColor: bgColor }}>
        {icons.map((t) => (
          <TabIconItem
            key={t}
            icon={t}
            stripColor={stripColor}
            selected={icons.indexOf(t) === selected}
            onPress={() => onTabPress(t)}
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
          paddingTop: 23,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function TabIconItem({ icon, selected = false, onPress, stripColor }) {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        borderBottomWidth: 3,
        paddingVertical: 8,
        borderBottomColor: selected ? stripColor : "transparent",
      }}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={{ width: 24, height: 24, resizeMode: "contain" }}
      />
    </TouchableOpacity>
  );
}

export default TabHeader;
