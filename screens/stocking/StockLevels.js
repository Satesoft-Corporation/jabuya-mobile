import { View, FlatList } from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";

import { MAXIMUM_RECORDS_PER_FETCH } from "../../constants/Constants";
import { Text } from "react-native";
import Colors from "../../constants/Colors";
import { BaseApiService } from "../../utils/BaseApiService";
import Snackbar from "../../components/Snackbar";
import { UserContext } from "../../context/UserContext";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import StockLevelCard from "./components/StockLevelCard";
import { PDT_ENTRY } from "../../navigation/ScreenNames";
import { SHOP_PRODUCTS_ENDPOINT } from "../../utils/EndPointUtils";

const StockLevel = ({ navigation }) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [stockLevels, setStockLevels] = useState([]);
  const [stockLevelRecords, setStockLevelRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const snackbarRef = useRef(null);

  const { userParams, selectedShop } = useContext(UserContext);

  const { isShopOwner, shopOwnerId } = userParams;

  const fetchShopProducts = async (offsetToUse = 0) => {
    try {
      setLoading(true);
      const allShops = selectedShop?.id === shopOwnerId;

      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        ...(allShops &&
          isShopOwner && {
            shopOwnerId: selectedShop?.id,
          }),
        ...(!allShops && { shopId: selectedShop?.id }),
        offset: offsetToUse,
        ...(searchTerm &&
          searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      };

      setIsFetchingMore(true);

      const response = await new BaseApiService(
        SHOP_PRODUCTS_ENDPOINT
      ).getRequestWithJsonResponse(searchParameters);

      if (offsetToUse === 0) {
        setStockLevels(response.records);
      } else {
        setStockLevels((prevEntries) => [...prevEntries, ...response?.records]);
      }

      setStockLevelRecords(response?.totalItems);

      if (response?.totalItems === 0) {
        setMessage("No shop products found");
      }

      if (response?.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }

      setIsFetchingMore(false);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  const onSearch = () => {
    setStockLevels([]);
    setOffset(0);
    fetchShopProducts();
  };

  useEffect(() => {
    fetchShopProducts();
  }, [selectedShop]);

  const handleEndReached = () => {
    if (!isFetchingMore && stockLevels.length < stockLevelRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
      fetchShopProducts(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (stockLevels.length === stockLevelRecords && stockLevels.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  const toProductEntry = () => {
    if (selectedShop?.name.includes("All")) {
      snackbarRef.current.show("Please select a shop before listing");
    } else {
      navigation.navigate(PDT_ENTRY);
    }
  };

  const menuItems = [
    {
      name: "List product",
      onClick: () => toProductEntry(),
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar />

      <TopHeader
        title="Stock levels"
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
        showMenuDots
        menuItems={menuItems}
        showShops
      />
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockLevels}
        renderItem={({ item }) => <StockLevelCard data={item} />}
        onRefresh={() => onSearch()}
        refreshing={loading}
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
        onEndReachedThreshold={0.3}
      />
      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockLevel;
