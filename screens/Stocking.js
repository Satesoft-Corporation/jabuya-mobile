import React, { useState, useRef, useCallback, memo, useMemo } from "react";
import { View, Dimensions, FlatList, Alert } from "react-native";

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
import SwiperFlatList from "react-native-swiper-flatlist";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let h = screenHeight * -1;

const Stocking = ({ route, navigation }) => {
  const { PurchaseTitle, LevelsTitle, ListingTitle } = StockingTabTitles;
  const tabTitles = [PurchaseTitle, LevelsTitle, ListingTitle];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(tabTitles[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false); //to fire the search based on the current page

  const params = route.params;

  const pages = [
    {
      id: 0,
      page: (
        <StockPurchase
          params={params}
          currentPage={currentPage}
          searchTerm={searchTerm}
          shouldSearch={triggerSearch}
        />
      ),
    },
    {
      id: 1,
      page: (
        <StockLevel
          params={params}
          currentPage={currentPage}
          searchTerm={searchTerm}
          shouldSearch={triggerSearch}
        />
      ),
    },
    {
      id: 2,
      page: (
        <StockListing
          params={params}
          currentPage={currentPage}
          searchTerm={searchTerm}
          shouldSearch={triggerSearch}
        />
      ),
    },
  ];

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const flatlistRef = useRef(null);

  const handleFormDestination = (form) => {
    navigation.navigate(form, params);
    return true;
  };

  const handleTabChange = (index) => {
    setCurrentIndex(index);
    setCurrentPage(tabTitles[index]);
    flatlistRef.current.scrollToIndex({ index, animated: true });
    setTriggerSearch(false);
  };

  const renderItem = useMemo(() => {
    return ({ item }) => (
      <View
        style={{
          width: Dimensions.get("window").width ,
          marginHorizontal: 1,
          paddingTop: 10,
        }}
      >
        {item.page}
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <FloatingButton
        handlePress={handleFormDestination}
        isAttendant={params.isShopAttendant}
        currentPage={currentPage}
      >
        <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

        <BlackScreen>
          <UserProfile navigation={navigation} />
          <SearchBar
            value={searchTerm}
            onChangeText={(text) => {
              setTriggerSearch(false);
              setSearchTerm(text);
            }}
            onSearch={() => {
              setTriggerSearch(true);
            }}
          />
          <TabHeader
            titles={tabTitles}
            selected={currentIndex}
            onTabPress={handleTabChange}
            setSelected={setCurrentIndex}
          />
        </BlackScreen>
        <View style={{ flex: 1, marginTop: 0 }}>
          <SwiperFlatList
            onChangeIndex={(obj) => {
              handleTabChange(obj.index);
            }}
            ref={flatlistRef}
            autoplay={false}
            index={currentIndex}
            data={pages}
            renderAll={true}
            renderItem={renderItem}
          />
        </View>
      </FloatingButton>
    </View>
  );
};

export default Stocking;
