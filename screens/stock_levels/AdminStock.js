import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MAXIMUM_RECORDS_PER_FETCH, userTypes } from "@constants/Constants";
import { BaseApiService } from "@utils/BaseApiService";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Snackbar from "@components/Snackbar";
import { SHOP_PRODUCTS_ENDPOINT } from "@utils/EndPointUtils";
import { PDT_ENTRY } from "@navigation/ScreenNames";
import { getFilterParams, getSelectedShop, getUserType } from "duqactStore/selectors";
import { useSelector } from "react-redux";
import StockLevelCard from "./StockLevelCard";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const AdminStock = () => {
  const [stockEntries, setStockEntries] = useState([]);
  const [stockEntryRecords, setStockEntryRecords] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const snackbarRef = useRef(null);

  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);
  const userType = useSelector(getUserType);

  const fetchStockEntries = async (offsetToUse = 0) => {
    if (isFocused) {
      try {
        setMessage(null);
        setLoading(true);

        const searchParameters = {
          limit: MAXIMUM_RECORDS_PER_FETCH,
          ...filterParams,
          offset: offsetToUse,
          ...(searchTerm && searchTerm.trim() !== "" && { searchTerm: searchTerm }),
        };

        setIsFetchingMore(true);

        const response = await new BaseApiService(SHOP_PRODUCTS_ENDPOINT).getRequestWithJsonResponse(searchParameters);

        if (offsetToUse === 0) {
          setStockEntries(response.records);
        } else {
          setStockEntries((prev) => [...prev, ...response?.records]);
        }
        setStockEntryRecords(response?.totalItems);
        setDisable(false);

        if (response?.totalItems === 0) {
          setMessage("No records found");
        }

        if (response.totalItems === 0 && searchTerm !== "") {
          setMessage(`No results found for ${searchTerm}`);
        }
        setIsFetchingMore(false);
        setLoading(false);
      } catch (error) {
        setDisable(false);
        setMessage("Error! " + error?.message);
        setLoading(false);
      }
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
  }, [selectedShop]);

  const toProductEntry = () => {
    if (selectedShop?.name.includes("All")) {
      snackbarRef.current.show("Please select a shop before listing");
    } else {
      navigation.navigate(PDT_ENTRY);
    }
  };

  const menuItems = [{ name: "List product", onClick: () => toProductEntry() }];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader
        title="Stock levels"
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
        disabled={disable}
        showMenuDots={userType !== userTypes.isShopAttendant}
        menuItems={menuItems}
        showShops
      />

      <FlatList
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item?.id?.toString()}
        data={stockEntries}
        renderItem={({ item }) => <StockLevelCard data={item} />}
        onRefresh={() => onSearch()}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>{stockEntryRecords === 0 && <Text>{message}</Text>}</View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default AdminStock;
