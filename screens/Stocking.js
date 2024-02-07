import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, TouchableOpacity, Text } from "react-native";

import Colors from "../constants/Colors";
import { StockingTabTitles } from "../constants/Constants";

import AppStatusBar from "../components/AppStatusBar";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import { FloatingButton } from "../components/FloatingButton";

import StockPurchase from "./StockPurchase";
import StockLevel from "./StockLevels";
import StockListing from "./StockListing";
import SearchBar from "../components/SearchBar";
import { SearchContext } from "../context/SearchContext";
import { UserContext } from "../context/UserContext";

const Stocking = ({ navigation }) => {
  const { PurchaseTitle, LevelsTitle, ListingTitle } = StockingTabTitles;
  const tabTitles = [PurchaseTitle, LevelsTitle, ListingTitle];

  const pages = [
    {
      id: 0,
      page: <StockPurchase />,
    },
    {
      id: 1,
      page: <StockLevel />,
    },
    {
      id: 2,
      page: <StockListing />,
    },
  ];
  const [currentPage, setCurrentPage] = useState(pages[0]);

  const { userParams } = useContext(UserContext);

  const handleFormDestination = (form) => {
    navigation.navigate(form, { ...userParams });
    return true;
  };
  const {
    searchTerm,
    setSearchTerm,
    setShouldSearch,
    setSearchOffset,
    setCurrentTab,
  } = useContext(SearchContext);

  return (
    <FloatingButton
      handlePress={handleFormDestination}
      isAttendant={userParams.isShopAttendant}
      currentPage={currentPage}
    >
      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

        <BlackScreen flex={0.4}>
          <UserProfile navigation={navigation} />

          <SearchBar
            value={searchTerm}
            onChangeText={(text) => {
              setShouldSearch(false);
              setSearchTerm(text);
            }}
            onSearch={() => {
              setShouldSearch(true);
            }}
          />

          <View
            style={{
              flexDirection: "row",
            }}
          >
            {tabTitles.map((title, index) => {
              const isFocused = currentPage.id === index;

              const onPress = () => {
                setShouldSearch(false);
                setSearchOffset(0);
                setCurrentTab(tabTitles[index]);
                setCurrentPage(pages[index]);
              };

              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderBottomWidth: 2,
                    borderBottomColor: isFocused
                      ? Colors.primary
                      : "transparent",
                    opacity: isFocused ? 1 : 0.6,
                  }}
                >
                  <Text
                    style={{
                      color: isFocused ? Colors.primary : Colors.light,
                      paddingBottom: 8,
                      paddingTop: 8,
                    }}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlackScreen>

        {currentPage.page}
      </View>
    </FloatingButton>
  );
};

export default Stocking;
