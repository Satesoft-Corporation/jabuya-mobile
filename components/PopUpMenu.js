import { Text } from "react-native";
import React from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import Colors from "../constants/Colors";
import Icon from "./Icon";
import { StatusBar } from "react-native";

const PopUpmenu = ({ menuItems = [] }) => {
  return (
    <Menu>
      <MenuTrigger
        text=""
        style={{
          width: 40,
          height: 40,
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
        }}
      >
        {menuItems.map((item, i) => (
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
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default PopUpmenu;
