import { View, Text, FlatList } from "react-native";
import React from "react";
import TopHeader from "../components/TopHeader";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import StockPurchaseListComponent from "../components/stocking/StockPurchaseListComponent";
import { SearchContext } from "../context/SearchContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { UserContext } from "../context/UserContext";
import { BaseApiService } from "../utils/BaseApiService";
import { MAXIMUM_RECORDS_PER_FETCH } from "../constants/Constants";
import { ActivityIndicator } from "react-native";
import { PanResponder } from "react-native";
import { useRef } from "react";

const StockingModel = () => {
  const { shouldSearch, currentTab } = useContext(SearchContext);

  const [stockEntries, setStockEntries] = useState([]);
  const [stockEntryRecords, setStockEntryRecords] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  const { userParams } = useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 50) {
          // Minimum swipe distance
          console.log("Swiped down!");
          setStockEntries([]);
          setOffset(0);
          setSearchTerm(null);
          fetchStockEntries();
        }
      },
    })
  ).current;

  const fetchStockEntries = async () => {
    try {
      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        ...(isShopAttendant && { shopId: attendantShopId }),
        ...(isShopOwner && { shopOwnerId }),
      };
      setIsFetchingMore(true);
      const response = await new BaseApiService(
        "/stock-entries"
      ).getRequestWithJsonResponse({
        ...searchParameters,
        offset: offset,
        ...(searchTerm &&
          searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      });

      setStockEntries((prevEntries) => [...prevEntries, ...response.records]);

      setStockEntryRecords(response.totalItems);
      if (response.totalItems === 0) {
        setMessage("No stock entries found");
      }

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
      setIsFetchingMore(false);
    } catch (error) {
      setLoading(false);

      setMessage("Error fetching stock records");
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && stockEntries.length < stockEntryRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
  };

  useEffect(() => {
    fetchStockEntries();
  }, [offset]);

  const renderFooter = () => {
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" color={Colors.dark} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 ,backgroundColor:Colors.light_2}}>
      <AppStatusBar content="light-content" bgColor="black" />

      <TopHeader title="Stock entries" />

      <SearchBar
        style={{
          borderWidth: 1,
          borderColor: Colors.gray,
        }}
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
        }}
        // onSearch={() => {
        //   setShouldSearch(true);
        // }}
      />
      <FlatList
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
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0}
      />
    </View>
  );
};

const Item = ({ data }) => {
  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
};
export default StockingModel;
