import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, FlatList, Text } from "react-native";
import { BaseApiService } from "../utils/BaseApiService";
import { StockingTabTitles } from "../constants/Constants";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";
import { SearchContext } from "../context/SearchContext";
import StockPurchaseListComponent from "../components/stocking/StockPurchaseListComponent";

const StockPurchase = ({ route }) => {
  const { PurchaseTitle } = StockingTabTitles;
  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    route.params;

  const {
    searchTerm,
    shouldSearch,
    currentTab,
    searchOffset,
    setSearchOffset,
  } = useContext(SearchContext);

  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [message, setMessage] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 6;
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const isPurchasesTab = currentTab === PurchaseTitle;

  const canSearch = () => {
    if (shouldSearch === true && isPurchasesTab) {
      if (searchTerm && searchTerm !== "") {
        return true;
      }
    }
    return false;
  };

  const fetchStockEntries = async () => {
    try {
      const searchParameters = {
        offset: searchOffset,
        limit,
        ...(canSearch() && { searchTerm }),
        ...(isShopAttendant && { shopId: attendantShopId }),
        ...(isShopOwner && { shopOwnerId }),
      };

      setIsFetchingMore(true);
      const response = await new BaseApiService(
        "/stock-entries"
      ).getRequestWithJsonResponse(searchParameters);

      setStockEntries((prevEntries) => [...prevEntries, ...response.records]);

      setTotalRecords(response.totalItems);

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
    } catch (error) {
      console.error("Error fetching stock entries:", error);
      setMessage("Error fetching stock entries");
    } finally {
      setIsFetchingMore(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(searchTerm);

    if (canSearch() === true) {
      setSearchOffset(0);
      setStockEntries([]);
      setLoading(true);
    }
    if (!isPurchasesTab) {
      setStockEntries([]);
    }
    fetchStockEntries();
  }, [searchOffset, shouldSearch]); // Empty dependency array to fetch stock entries once on component mount

  const handleEndReached = () => {
    if (!isFetchingMore && stockEntries.length < totalRecords) {
      setSearchOffset(searchOffset + limit);
      console.log("fetching data at offest", searchOffset);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <OrientationLoadingOverlay
        visible={loading}
        color={Colors.primary}
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
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
            {totalRecords === 0 && (
              <Text>{message || "No purchases found."}</Text>
            )}
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        // onEndReachedThreshold sets how far from the end of the list (in terms of proportion of the total items) the user must scroll to trigger the onEndReached event
      />
    </View>
  );
};

export default StockPurchase;
