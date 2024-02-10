import React, { useState, useEffect, useContext, memo } from "react";
import { View, FlatList, Text } from "react-native";
import {
  MAXIMUM_RECORDS_PER_FETCH,
  StockingTabTitles,
} from "../constants/Constants";

import { SearchContext } from "../context/SearchContext";
import StockPurchaseListComponent from "../components/stocking/StockPurchaseListComponent";

const StockPurchase = ({ getData, setLoading }) => {
  const { PurchaseTitle } = StockingTabTitles;

  const {
    shouldSearch,
    currentTab,
    stockEntries,
    setStockEntries,
    stockEntryRecords,
    isFetchingMore,
    searchTerm,
    stockEntryOffset,
    setStockEntryOffset,
    message,
  } = useContext(SearchContext);

  const [shouldFetch, setShoudFetch] = useState(false);

  const isPurchasesTab = currentTab === PurchaseTitle;

  const canSearch = () => {
    if (shouldSearch === true && isPurchasesTab) {
      if (searchTerm && searchTerm !== "") {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (canSearch() === true) {
      setStockEntryOffset(0);
      setStockEntries([]);
      setLoading(true);
      getData(0, searchTerm);
      setLoading(false);
    }
  }, [shouldSearch]);

  useEffect(() => {
    if (stockEntries.length > 0 && shouldFetch === true) {
      getData(stockEntryOffset, searchTerm);
      setShoudFetch(false);
    }
  }, [stockEntryOffset]);

  const handleEndReached = () => {
    if (!isFetchingMore && stockEntries.length < stockEntryRecords) {
      setStockEntryOffset(stockEntryOffset + MAXIMUM_RECORDS_PER_FETCH);
      setShoudFetch(true);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 5 }}>
      <FlatList
        contentContainerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        data={stockEntries}
        renderItem={({ item }) => <StockPurchaseListComponent data={item} />}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {stockEntryRecords === 0 && <Text>{message}</Text>}
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0}
      />
    </View>
  );
};

export default memo(StockPurchase);
