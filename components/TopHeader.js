import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../constants/Colors";
import SearchBar from "./SearchBar";
import { UserContext } from "../context/UserContext";

const TopHeader = ({
  title = "Details",
  onBackPress,
  showSearch = false,
  searchTerm,
  setSearchTerm,
  onSearch,
  showShopName = true,
}) => {
  const [showBar, setShowBar] = useState(false);

  const { selectedShop } = useContext(UserContext);

  const toggleSearch = () => {
    setShowBar(!showBar);
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: Colors.dark,
        }}
      >
        <View
          style={{
            height: 40,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={onBackPress}>
            <Image
              source={require("../assets/icons/icons8-chevron-left-30.png")}
              style={{
                height: 30,
                width: 20,
                resizeMode: "contain",
                tintColor: Colors.primary,
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: Colors.primary,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            {title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              minWidth: 30,
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
                    tintColor: Colors.primary,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showShopName && (
          <Text
            style={{
              color: Colors.primary,
              textAlign: "center",
              alignSelf: "center",
              fontSize: 13,
              paddingVertical: 2,
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
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
          onSearch={onSearch}
        />
      )}
    </>
  );
};

export default TopHeader;
