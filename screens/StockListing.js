import { View, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import { MAXIMUM_RECORDS_PER_FETCH } from "../constants/Constants";

import { Text } from "react-native";
import { useContext } from "react";
import StockListingListComponent from "../components/stocking/StockListingListComponent";
import Colors from "../constants/Colors";
import { BaseApiService } from "../utils/BaseApiService";
import Snackbar from "../components/Snackbar";
import { UserContext } from "../context/UserContext";
import AppStatusBar from "../components/AppStatusBar";
import TopHeader from "../components/TopHeader";

const StockListing = ({ navigation }) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const [shopProducts, setShopProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const snackbarRef = useRef(null);

  const { userParams } = useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const fetchShopProducts = async () => {
    try {
      setShowFooter(true);

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
        "/shop-products"
      ).getRequestWithJsonResponse(searchParameters);

      setShopProducts((prevEntries) => [...prevEntries, ...response?.records]);

      setTotalProducts(response?.totalItems);

      if (response?.totalItems === 0) {
        setMessage("No shop products found");
        setShowFooter(false);
      }

      if (response?.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
        setShowFooter(false);
      }

      setIsFetchingMore(false);
    } catch (error) {
      setLoading(false);
      setShowFooter(false);
      setMessage("Error fetching stock records");
    }
  };

  const onSearch = () => {
    setShopProducts([]);
    setOffset(0);
    fetchShopProducts();
  };

  useEffect(() => {
    fetchShopProducts();
  }, [offset]);

  const renderFooter = () => {
    if (showFooter === true) {
      if (shopProducts.length === totalProducts && shopProducts.length > 0) {
        return null;
      }

      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating size="large" color={Colors.dark} />
        </View>
      );
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && shopProducts.length < totalProducts) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (shopProducts.length === totalProducts && shopProducts.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar />

      <TopHeader
        title="Shop products"
        showSearch={true}
        
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={onSearch}
      />

      <FlatList
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
        data={shopProducts}
        renderItem={({ item }) => <StockListingListComponent data={item} />}
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
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0}
      />

      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockListing;
