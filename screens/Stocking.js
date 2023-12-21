import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";

import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import TabHeader from "../components/TabHeader";
import StockPurchase from "./StockPurchase";
import { FloatingButton } from "../components/FloatingButton";
import StockLevel from "./StockLevels";
import StockListing from "./StockListing";

const Stocking = ({ route }) => {
  const tabTitles = ["Stock purchase", "Stock level", "Stock listing"];
  const params = route.params;

  const pages = [
    {
      id: 0,
      page: <StockPurchase params={params} />,
    },
    {
      id: 1,
      page: <StockLevel params={params} />,
    },
    {
      id: 2,
      page: <StockListing params={params}/>,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const flatlistRef = useRef(null);

  const handleTabChange = (index) => {
    setCurrentIndex(index);
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
          paddingTop: 0,
        }}
      >
        {item.page}
      </View>
    ),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <FloatingButton>
        <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

        <BlackScreen flex={0.14}>
          <UserProfile  navigation={navigation}/>

          <TabHeader
            titles={tabTitles}
            onActiveChanged={handleTabChange}
            activeIndex={currentIndex}
          />
        </BlackScreen>
        <View style={{ flex: 1, marginTop: 30 }}>
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
