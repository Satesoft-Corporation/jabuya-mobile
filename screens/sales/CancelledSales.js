import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MAXIMUM_RECORDS_PER_FETCH, userTypes } from "@constants/Constants";
import { BaseApiService } from "@utils/BaseApiService";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Snackbar from "@components/Snackbar";
import { SHOP_SALES_ENDPOINT, STOCK_ENTRY_ENDPOINT } from "@utils/EndPointUtils";
import { STOCK_ENTRY_FORM } from "@navigation/ScreenNames";
import { getFilterParams, getSelectedShop, getUserType } from "duqactStore/selectors";
import { useSelector } from "react-redux";
import DeleteRecordModal from "@components/DeleteRecordModal";
import DamagesForm from "@screens/damages/DamagesForm";
import { getCanCreateUpdateMyShopStock } from "duqactStore/selectors/permissionSelectors";
import SaleTxnCard from "./components/SaleTxnCard";

const CancelledSales = ({ navigation }) => {
  const [returnedItems, setReturnedItems] = useState([]);
  const [returnedRecords, setReturnedRecords] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [damagesForm, setDamagesForm] = useState(false);

  const snackbarRef = useRef(null);

  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);
  const userType = useSelector(getUserType);

  const getReturnedItems = async (offsetToUse = 0) => {
    try {
      setMessage(null);
      setLoading(true);
      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        ...filterParams,
        offset: offsetToUse,
        ...(searchTerm && searchTerm.trim() !== "" && { searchTerm: searchTerm }),
        status: "CANCELLED",
      };

      setIsFetchingMore(true);

      const response = await new BaseApiService(SHOP_SALES_ENDPOINT).getRequestWithJsonResponse(searchParameters);

      if (offsetToUse === 0) {
        setReturnedItems(response.records);
      } else {
        setReturnedItems((prev) => [...prev, ...response?.records]);
      }
      setReturnedRecords(response?.totalItems);
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
      setMessage("Error! " + error?.message);
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && returnedItems.length < returnedRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
      getReturnedItems(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (returnedItems.length === returnedRecords && returnedItems.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  const onSearch = () => {
    setDisable(true);
    setReturnedItems([]);
    setOffset(0);
    getReturnedItems();
  };

  useEffect(() => {
    getReturnedItems();
  }, [selectedShop]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader title="Returned items" />

      <FlatList
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item?.id?.toString()}
        data={returnedItems}
        renderItem={({ item, i }) => <SaleTxnCard data={item} key={i} onClient onReturns />}
        onRefresh={() => onSearch()}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>{returnedRecords === 0 && <Text>{message}</Text>}</View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default CancelledSales;
