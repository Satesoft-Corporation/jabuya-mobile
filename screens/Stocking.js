import React, { useState, useRef, useCallback, memo } from "react";
import { View, Dimensions, FlatList } from "react-native";

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

const Stocking = ({ route, navigation }) => {
  const { PurchaseTitle, LevelsTitle, ListingTitle } = StockingTabTitles;

  const tabTitles = [PurchaseTitle, LevelsTitle, ListingTitle];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(tabTitles[0]);

  const params = route.params;

  const pages = [
    {
      id: 0,
      page: <StockPurchase params={params} currentPage={currentPage} />,
    },
    {
      id: 1,
      page: <StockLevel params={params} currentPage={currentPage} />,
    },
    {
      id: 2,
      page: <StockListing params={params} currentPage={currentPage} />,
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
    const windowWidth = Dimensions.get("window").width;
    const offset = index * windowWidth;
    flatlistRef.current.scrollToOffset({ offset, animated: true });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderItem = useCallback(
    ({ item }) => (
      <View
        style={{
          width: Dimensions.get("window").width - 2,
          marginHorizontal: 1,
          paddingTop: 10,
        }}
      >
        {item.page}
      </View>
    ),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <FloatingButton
        handlePress={handleFormDestination}
        isAttendant={params.isShopAttendant}
      >
        <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

        <BlackScreen flex={0.14}>
          <UserProfile navigation={navigation} />

          <TabHeader
            titles={tabTitles}
            onActiveChanged={handleTabChange}
            activeIndex={currentIndex}
          />
        </BlackScreen>
        <View style={{ flex: 1, marginTop: 0 }}>
          <FlatList
            scrollEnabled={false}
            ref={flatlistRef}
            horizontal
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            data={pages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewConfigRef.current}
          />
        </View>
      </FloatingButton>
    </View>
  );
};

export default memo(Stocking);
