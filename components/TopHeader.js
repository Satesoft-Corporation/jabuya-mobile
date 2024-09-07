import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "@constants/Colors";
import PopUpmenu from "./PopUpMenu";
import SearchBar from "./SearchBar";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { getSelectedShop } from "reducers/selectors";

const TopHeader = ({
  title = "Details",
  showSearch = false,
  searchTerm,
  setSearchTerm,
  onSearch,
  showShopName = true,
  showMenuDots = false,
  menuItems,
  showShops = false,
}) => {
  const [showBar, setShowBar] = useState(false);
  const selectedShop = useSelector(getSelectedShop);

  const navigation = useNavigation();
  const toggleSearch = () => {
    setShowBar(!showBar);
  };

  return (
    <View style={{ backgroundColor: "#000" }}>
      <View style={{ paddingHorizontal: 10, backgroundColor: Colors.dark }}>
        <View
          style={{
            height: 40,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../assets/icons/icons8-chevron-left-30.png")}
                style={{
                  height: 30,
                  width: 20,
                  resizeMode: "contain",
                }}
                tintColor={Colors.primary}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: Colors.primary,
                fontSize: scale(17),
                marginStart: 10,
              }}
            >
              {title}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              minWidth: 30,
              justifyContent: "flex-end",
              flexDirection: "row",
              gap: 10,
            }}
          >
            {showSearch && (
              <TouchableOpacity onPress={toggleSearch}>
                <Image
                  source={require("../assets/icons/ic_search_gray.png")}
                  style={{
                    height: 30,
                    width: 20,
                    resizeMode: "contain",
                  }}
                  tintColor={Colors.primary}
                />
              </TouchableOpacity>
            )}

            {showMenuDots && (
              <PopUpmenu menuItems={menuItems} showShops={showShops} />
            )}
          </View>
        </View>

        {showShopName && selectedShop && (
          <Text
            style={{
              color: Colors.primary,
              fontSize: scale(13),
              paddingBottom: 8,
              marginStart: 30,
              marginTop: -10,
            }}
          >
            {selectedShop?.name}
          </Text>
        )}
      </View>

      {showBar && (
        <SearchBar
          style={{
            borderWidth: 1,
            borderColor: Colors.gray,
            marginBottom: 5,
          }}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSearch={onSearch}
        />
      )}
    </View>
  );
};

export default TopHeader;
