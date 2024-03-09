import { View, Text, FlatList } from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import TopHeader from "../components/TopHeader";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import StockPurchaseListComponent from "../components/stocking/StockPurchaseListComponent";
import { UserContext } from "../context/UserContext";
import { BaseApiService } from "../utils/BaseApiService";
import { MAXIMUM_RECORDS_PER_FETCH } from "../constants/Constants";
import { ActivityIndicator } from "react-native";
import { PanResponder } from "react-native";
import Snackbar from "../components/Snackbar";

const StockPurchase = ({ navigation }) => {
  const [stockEntries, setStockEntries] = useState([]);
  const [stockEntryRecords, setStockEntryRecords] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const [disable, setDisable] = useState(false);

  const snackbarRef = useRef(null);
  const { userParams } = useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 50) {
          // Minimum swipe distance
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
      setShowFooter(true);
      setMessage(null);

      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        ...(isShopAttendant && { shopId: attendantShopId }),
        ...(isShopOwner && { shopOwnerId }),
        offset: offset,
        ...(searchTerm &&
          searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      };

      setIsFetchingMore(true);

      const response = await new BaseApiService(
        "/stock-entries"
      ).getRequestWithJsonResponse(searchParameters);

      setStockEntries((prevEntries) => [...prevEntries, ...response?.records]);

      setStockEntryRecords(response?.totalItems);
      setDisable(false);

      if (response?.totalItems === 0) {
        setMessage("No stock entries found");
        setShowFooter(false);
      }

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
        setShowFooter(false);
      }

      setIsFetchingMore(false);
    } catch (error) {
      setDisable(false);
      setLoading(false);
      setShowFooter(false);
      setMessage("Error fetching stock records");
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && stockEntries.length < stockEntryRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (stockEntries.length === stockEntryRecords && stockEntries.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  const onSearch = () => {
    setDisable(true);
    setStockEntries([]);
    setOffset(0);
    fetchStockEntries();
  };

  useEffect(() => {
    fetchStockEntries();
  }, [offset]);

  const renderFooter = () => {
    if (showFooter === true) {
      if (
        stockEntries.length === stockEntryRecords &&
        stockEntries.length > 0
      ) {
        return null;
      }

      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating size="large" color={Colors.dark} />
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <TopHeader
        title="Stock purchases"
        showSearch={true}
        onBackPress={() => navigation.goBack()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
        disabled={disable}
      />

      <FlatList
        style={{ marginTop: 5 }}
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

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockPurchase;
