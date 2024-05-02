import { Text, FlatList } from "react-native";
import React, { useCallback } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import Colors from "../constants/Colors";
import Icon from "./Icon";
import { StatusBar } from "react-native";
import { screenHeight } from "../constants/Constants";

const PopUpmenu = ({ menuItems = [] }) => {
  const renderItem = useCallback(
    ({ item, i }) => (
      <MenuOption key={i} onSelect={() => item?.onClick()}>
        <Text
          style={{
            paddingVertical: 5,
            fontSize: 15,
            fontWeight: item?.bold ? 600 : 400,
            color: Colors.dark,
          }}
        >
          {item.name}
        </Text>
      </MenuOption>
    ),
    []
  );
  return (
    <Menu>
      <MenuTrigger
        text=""
        style={{
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 100,
        }}
      >
        <Icon
          groupName="Entypo"
          name="dots-three-vertical"
          size={20}
          color={Colors.primary}
        />
      </MenuTrigger>
      <MenuOptions
        optionsContainerStyle={{
          backgroundColor: Colors.light_2,
          padding: 6,
          borderRadius: 5,
          marginTop: StatusBar.currentHeight,
          maxHeight: screenHeight / 1.5,
        }}
      >
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.name.toString()}
        />
      </MenuOptions>
    </Menu>
  );
};

export default PopUpmenu;
