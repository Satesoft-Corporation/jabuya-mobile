import { View, Text, FlatList } from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import TopHeader from "../../components/TopHeader";
import AppStatusBar from "../../components/AppStatusBar";
import Colors from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import { BaseApiService } from "../../utils/BaseApiService";
import { MAXIMUM_RECORDS_PER_FETCH } from "../../constants/Constants";
import Snackbar from "../../components/Snackbar";
import StockPurchaseCard from "./components/StockPurchaseCard";
import { STOCK_ENTRY_FORM } from "../../navigation/ScreenNames";

const StockPurchase = ({ navigation }) => {
  const [stockEntries, setStockEntries] = useState([]);
  const [stockEntryRecords, setStockEntryRecords] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const snackbarRef = useRef(null);
  const { selectedShop } = useContext(UserContext);

  const fetchStockEntries = async (offsetToUse = 0) => {
    try {
      setMessage(null);
      setLoading(true);

      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        ...(selectedShop?.id !== 0 && { shopId: selectedShop?.id }),
        offset: offsetToUse,
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
      }

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
      setIsFetchingMore(false);
      setLoading(false);
    } catch (error) {
      setDisable(false);

      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && stockEntries.length < stockEntryRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
      fetchStockEntries(offset + MAXIMUM_RECORDS_PER_FETCH);
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
  }, []);

  const menuItems = [
    {
      name: "Add purchase",
      onClick: () => navigation.navigate(STOCK_ENTRY_FORM),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <TopHeader
        title="Stock purchases"
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
        disabled={disable}
        showMenuDots
        menuItems={menuItems}
      />

      <FlatList
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item.id.toString()}
        data={stockEntries}
        renderItem={({ item }) => <StockPurchaseCard data={item} />}
        onRefresh={() => onSearch()}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {stockEntryRecords === 0 && <Text>{message}</Text>}
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockPurchase;
