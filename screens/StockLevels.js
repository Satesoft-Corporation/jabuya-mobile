import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo, useContext } from "react";

import {
  MAXIMUM_RECORDS_PER_FETCH,
  StockingTabTitles,
} from "../constants/Constants";
import { Text } from "react-native";

import { SearchContext } from "../context/SearchContext";
import StockLevelListComponent from "../components/stocking/StockLevelListComponent";

const StockLevel = ({ getData, setLoading }) => {
  const [shouldFetch, setShoudFetch] = useState(false);

  const { LevelsTitle } = StockingTabTitles;

  const {
    shouldSearch,
    currentTab,
    stockLevels,
    setStockLevels,
    stockLevelRecords,
    isFetchingMore,
    searchTerm,
    stockLevelOffset,
    message,
    setStockLevelOffset,
  } = useContext(SearchContext);

  const isStockLevelsTab = currentTab === LevelsTitle;

  const canSearch = () => {
    if (shouldSearch === true && isStockLevelsTab) {
      if (searchTerm && searchTerm !== "") {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (canSearch() === true) {
      setStockLevelOffset(0);
      setStockLevels([]);
      setLoading(true);
      getData(0, searchTerm);
      setLoading(false);
    }
  }, [shouldSearch]);

  useEffect(() => {
    if (stockLevels.length > 0 && shouldFetch === true) {
      getData(stockLevelOffset, searchTerm);
      setShoudFetch(false);
    }
  }, [stockLevelOffset]);

  const handleEndReached = () => {
    if (!isFetchingMore && stockLevels.length < stockLevelRecords) {
      setStockLevelOffset(stockLevelOffset + MAXIMUM_RECORDS_PER_FETCH);
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
        data={stockLevels}
        renderItem={({ item }) => <StockLevelListComponent data={item} />}
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

export default memo(StockLevel);
