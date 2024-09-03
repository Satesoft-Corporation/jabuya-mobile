import { Text, FlatList } from "react-native";
import React, { useCallback, useContext } from "react";
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
import { getSelectedShop, getShops } from "reducers/selectors";
import { useDispatch, useSelector } from "react-redux";
import { changeSelectedShop } from "actions/shopActions";

const PopUpmenu = ({ menuItems = [], showShops = false }) => {
  const dispatch = useDispatch();

  const selectedShop = useSelector(getSelectedShop);
  const shops = useSelector(getShops);

  const modifiedShopList =
    showShops && shops?.length > 1
      ? shops?.map((shop) => {
          return {
            ...shop,
            onClick: () => dispatch(changeSelectedShop(shop)),
            bold: shop?.id === selectedShop?.id,
          };
        })
      : [];

  const renderItem = useCallback(
    ({ item, i }) => (
      <MenuOption
        key={i}
        onSelect={() => item?.onClick()}
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
      >
        <Text
          style={{
            paddingVertical: 5,
            fontSize: 15,
            fontWeight: item?.bold ? 600 : 400,
            color: Colors.dark,
          }}
        >
          {item?.name}
        </Text>
        {item?.share && <Icon name="share-alt" size={14} />}
      </MenuOption>
    ),
    [menuItems]
  );

  return (
    <Menu>
      <MenuTrigger
        text=""
        style={{
          width: 25,
          alignItems: "center",
          justifyContent: "center",
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
          data={[...menuItems, ...modifiedShopList]}
          renderItem={renderItem}
          keyExtractor={(item) => item.name.toString()}
        />
      </MenuOptions>
    </Menu>
  );
};

export default PopUpmenu;
