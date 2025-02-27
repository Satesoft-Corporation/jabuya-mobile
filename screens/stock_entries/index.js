import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { MAXIMUM_RECORDS_PER_FETCH, userTypes } from "@constants/Constants";
import { BaseApiService } from "@utils/BaseApiService";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import StockEntryCard from "./StockEntryCard";
import Snackbar from "@components/Snackbar";
import { STOCK_ENTRY_ENDPOINT } from "@utils/EndPointUtils";
import { STOCK_ENTRY_FORM } from "@navigation/ScreenNames";
import { getFilterParams, getSelectedShop, getUserType } from "duqactStore/selectors";
import { useSelector } from "react-redux";
import DeleteRecordModal from "@components/DeleteRecordModal";
import DamagesForm from "@screens/damages/DamagesForm";
import { getCanCreateUpdateMyShopStock } from "duqactStore/selectors/permissionSelectors";

const StockEntries = ({ navigation }) => {
  const [stockEntries, setStockEntries] = useState([]);
  const [stockEntryRecords, setStockEntryRecords] = useState(0);
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

  const fetchStockEntries = async (offsetToUse = 0) => {
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

      const response = await new BaseApiService(STOCK_ENTRY_ENDPOINT).getRequestWithJsonResponse(searchParameters);

      if (offsetToUse === 0) {
        setStockEntries(response.records);
      } else {
        setStockEntries((prev) => [...prev, ...response?.records]);
      }
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
      setMessage("Error! " + error?.message);
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
  }, [selectedShop]);

  const menuItems = [{ name: "Add purchase", onClick: () => navigation.navigate(STOCK_ENTRY_FORM) }];
  const canDoStockCrud = useSelector(getCanCreateUpdateMyShopStock);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader
        title="Stock purchases"
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
        disabled={disable}
        showMenuDots={canDoStockCrud}
        menuItems={menuItems}
        showShops
      />

      <DeleteRecordModal
        selectedRecord={selectedEntry}
        showModal={deleteModal}
        setShowModal={setDeleteModal}
        showForm
        isStockEntry
        onComplete={() => {
          snackbarRef?.current?.show("Record deleted successfully.");
          fetchStockEntries();
        }}
      />

      <DamagesForm
        setVisible={setDamagesForm}
        visible={damagesForm}
        stockEntry={selectedEntry}
        onSave={() => {
          snackbarRef.current.show("Damage record saved.");
        }}
      />

      <FlatList
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item?.id?.toString()}
        data={stockEntries}
        renderItem={({ item, i }) => (
          <StockEntryCard
            data={item}
            key={i}
            handleDelete={() => {
              setSelectedEntry(item);
              setDeleteModal(true);
            }}
            handleDamage={() => {
              setSelectedEntry(item);
              setDamagesForm(true);
            }}
          />
        )}
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

export default StockEntries;
