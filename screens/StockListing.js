import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import {
  MAXIMUM_RECORDS_PER_FETCH,
  StockingTabTitles,
} from "../constants/Constants";

import { Text } from "react-native";
import { SearchContext } from "../context/SearchContext";
import { useContext } from "react";
import StockListingListComponent from "../components/stocking/StockListingListComponent";

const StockListing = ({ getData, setLoading }) => {
  const {
    shouldSearch,
    currentTab,
    stockListing,
    setStockListing,
    stockListRecords,
    stockListOffset,
    setStockListOffset,
    isFetchingMore,
    searchTerm,
    message,
  } = useContext(SearchContext);

  const { ListingTitle } = StockingTabTitles;

  const [shouldFetch, setShoudFetch] = useState(false);

  const isStockListingTab = currentTab === ListingTitle;

  const canSearch = () => {
    if (shouldSearch === true && isStockListingTab) {
      if (searchTerm && searchTerm !== "") {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (canSearch() === true) {
      setStockListOffset(0);
      setStockListing([]);
      setLoading(true);
      getData(0, searchTerm);
      setLoading(false);
    }
  }, [shouldSearch]);

  useEffect(() => {
    if (stockListing.length > 0 && shouldFetch === true) {
      getData(stockListOffset, searchTerm);
      setShoudFetch(false);
    }
  }, [stockListOffset]);

  const handleEndReached = () => {
    if (!isFetchingMore && stockListing.length < stockListRecords) {
      setStockListOffset(stockListOffset + MAXIMUM_RECORDS_PER_FETCH);
      setShoudFetch(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 5,
      }}
    >
      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockListing}
        renderItem={({ item }) => <StockListingListComponent data={item} />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{message}</Text>
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0}
      />
    </View>
  );
};

export default memo(StockListing);
