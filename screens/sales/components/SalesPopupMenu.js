import { View, Text } from "react-native";
import React, { useRef, useContext } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../../context/UserContext";
import { SHOP_SUMMARY } from "../../../navigation/ScreenNames";
import Colors from "../../../constants/Colors";

const SalesPopupMenu = ({ menuRef, reload, showDatePicker }) => {
  const { shops, selectedShop, setSelectedShop, userParams } =
    useContext(UserContext);

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
    userParams?.isShopOwner && {
      name: "Investment",
      onClick: () => navigation.navigate(SHOP_SUMMARY),
    },
    ...(shops?.length > 1 ? [...shops] : []),
  ];
  return (
    <View style={{ alignSelf: "flex-end", marginTop: -10 }}>
      <Menu ref={menuRef}>
        <MenuTrigger text="" disabled />
        <MenuOptions
          optionsContainerStyle={{
            backgroundColor: Colors.light_2,
            padding: 10,
            borderRadius: 5,
            marginTop: 5,
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
