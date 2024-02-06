import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, TouchableOpacity, Text } from "react-native";

import Colors from "../constants/Colors";
import { StockingTabTitles } from "../constants/Constants";

import AppStatusBar from "../components/AppStatusBar";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import TabHeader from "../components/TabHeader";
import { FloatingButton } from "../components/FloatingButton";

import StockPurchase from "./StockPurchase";
import StockLevel from "./StockLevels";
import StockListing from "./StockListing";
// import { SearchBar } from "react-native-elements";
import SearchBar from "../components/SearchBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SearchProvider, SearchContext } from "../context/SearchContext";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  const {
    searchTerm,
    setSearchTerm,
    setShouldSearch,
    setCurrentTab,
    setSearchOffset,
  } = useContext(SearchContext);

  return (
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
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            setShouldSearch(false);
            setSearchOffset(0);
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
            setCurrentTab(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor: isFocused ? Colors.primary : "transparent",
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
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlackScreen>
  );
}

const Stocking = ({ route, navigation }) => {
  const { PurchaseTitle, LevelsTitle, ListingTitle } = StockingTabTitles;
  const tabTitles = [PurchaseTitle, LevelsTitle, ListingTitle];

  const [currentPage, setCurrentPage] = useState(tabTitles[0]);

  // const params = route.params;
  const params = {
    isShopAttendant: false,
    isShopOwner: true,
    shopOwnerId: 2453,
  };

  const handleFormDestination = (form) => {
    navigation.navigate(form, params);
    return true;
  };
  return (
    <SearchProvider>
      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <FloatingButton
          handlePress={handleFormDestination}
          isAttendant={params.isShopAttendant}
          currentPage={currentPage}
        >
          <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

          <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
            <Tab.Screen
              name={PurchaseTitle}
              component={StockPurchase}
              initialParams={params}
            />
            <Tab.Screen
              name={LevelsTitle}
              component={StockLevel}
              initialParams={params}
            />
            <Tab.Screen
              name={ListingTitle}
              component={StockListing}
              initialParams={params}
            />
          </Tab.Navigator>
        </FloatingButton>
      </View>
    </SearchProvider>
  );
};

export default Stocking;
