import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo, useContext } from "react";

import { StockLevelTransactionItem } from "../components/TransactionItems";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";
import { Text } from "react-native";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";
import { SearchContext } from "../context/SearchContext";
import { UserContext } from "../context/UserContext";

const StockLevel = memo(({ route }) => {
  const [stockLevels, setStockLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 6;
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  console.log(totalRecords,currentTab)

  const { LevelsTitle } = StockingTabTitles;
  const { userParams } = useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const {
    searchTerm,
    shouldSearch,
    currentTab,
    searchOffset,
    setSearchOffset,
  } = useContext(SearchContext);

  const isPurchasesTab = currentTab === LevelsTitle;

  const canSearch = () => {
    if (shouldSearch === true && isPurchasesTab) {
      if (searchTerm && searchTerm !== "") {
        return true;
      }
    }
    return false;
  };

  const fetchStockLevels = async () => {
    let searchParameters = {
      offset: searchOffset,
      limit: limit,
      ...(canSearch() && { searchTerm }),
      ...(isShopAttendant && { shopId: attendantShopId }),
      ...(isShopOwner && { shopOwnerId }),
    };

    if (isShopAttendant) {
      searchParameters.shopId = attendantShopId;
    }
    if (isShopOwner) {
      searchParameters.shopOwnerId = shopOwnerId;
    }
    setIsFetchingMore(true);

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setStockLevels((prevEntries) => [...prevEntries, ...response.records]);

        setTotalRecords(response.totalItems);

        if (response.totalItems === 0 && searchTerm !== "") {
          setMessage(`No results found for ${searchTerm}`);
        }
        setIsFetchingMore(false);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isPurchasesTab) {
      fetchStockLevels();
    }
  }, [searchOffset]);

  useEffect(() => {
    if (canSearch() === true) {
      setSearchOffset(0);
      setStockEntries([]);
      setLoading(true);
      fetchStockLevels();
    }
  }, [shouldSearch]);

  const handleEndReached = () => {
    if (isPurchasesTab) {
      if (!isFetchingMore && stockLevels.length < totalRecords) {
        setSearchOffset(searchOffset + limit);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 5
      }}
    >
      <OrientationLoadingOverlay
        visible={loading}
        color={Colors.primary}
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockLevels}
        renderItem={({ item }) => <StockLevelTransactionItem data={item} />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No stock records found.</Text>
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
});

export default memo(StockLevel);
