import { View, Text, StyleSheet } from "react-native";
import React, { useRef, useContext } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Colors from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { SHOP_SUMMARY } from "../../navigation/ScreenNames";

const SalesPopupMenu = ({ menuRef, reload, showDatePicker }) => {
  const { shops, selectedShop, setSelectedShop } = useContext(UserContext);
  const navigation = useNavigation();

  const menuItems = [
    {
      name: "Reload list",
      onClick: () => reload(),
    },
    {
      name: "Select date range",
      onClick: () => showDatePicker(),
    },
    {
      name: "Investment",
      onClick: () => navigation.navigate(SHOP_SUMMARY),
    },
    // {
    //   name: "Select shop",
    //   disabled: true,
    // },
    ...shops,
  ];
  return (
    <View>
      <Menu ref={menuRef}>
        <MenuTrigger text="" disabled />
        <MenuOptions
          optionsContainerStyle={{
            backgroundColor: Colors.light_2,
            padding: 10,
            borderRadius: 5,
            marginTop: 5,

            // width: 150,
          }}
        >
          {menuItems.map((item, i) => (
            <MenuOption
              key={i}
              disabled={item?.disabled === true}
              onSelect={() => {
                if (item.onClick) {
                  item?.onClick();
                }
                if (item?.id) {
                  setSelectedShop(item);
                }
              }}
            >
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 16,
                  fontWeight: item?.id === selectedShop?.id ? 600 : 400,
                  color: item?.disabled ? Colors.gray : Colors.dark,
                }}
              >
                {item.name}
              </Text>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default SalesPopupMenu;
