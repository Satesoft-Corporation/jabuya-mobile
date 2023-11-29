import React, { useEffect, useState } from "react";
import { Animated, Easing, View, Text } from "react-native";
import Colors from "../constants/Colors";
import { TouchableOpacity } from "react-native";

export default function CircularProgress() {
  const [item, setItem] = useState(1);

  const tick = () => {
    let nextItem = item === 3 ? 1 : item + 1;
    setItem(nextItem);
  };

  useEffect(() => {
    const interval = setInterval(tick, 120);
    return () => {
      clearInterval(interval);
    };
  }, [item]);

  return (
    <TouchableOpacity
      disabled
      style={{
        backgroundColor: Colors.dark,
        marginTop: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 70,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <DotItem isActive={item === 1} />
        <DotItem isActive={item === 2} />
        <DotItem isActive={item === 3} />
      </View>
    </TouchableOpacity>
  );
}

function DotItem({ isActive }) {
  return (
    <View
      style={{
        width: isActive ? 10 : 6,
        height: isActive ? 10 : 6,
        borderRadius: isActive ? 5 : 3,
        backgroundColor: Colors.primary,
      }}
    />
  );
}
