import { View, FlatList, Text } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { StockListingTransactionItem } from "../components/TransactionItems";
import { BaseApiService } from "../utils/BaseApiService";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";

const StockListing = memo(({ params }) => {
  const [stockListing, setStockListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } = params;

  const fetchStockLevels = async () => {
    setLoading(true);
    let searchParameters = {
      offset: 0,
      limit: 0,
    };
    if (isShopAttendant) {
      searchParameters.shopId = attendantShopId;
    }
    if (isShopOwner) {
      searchParameters.shopOwnerId = shopOwnerId;
    }

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setStockListing(response.records);
        setTotalRecords(response.totalItems);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchStockLevels();
  }, []);
  return (
    <View
      style={{
        justifyContent: "center",
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
        data={stockListing}
        renderItem={({ item }) => <StockListingTransactionItem data={item} />}
      />
    </View>
  );
});

export default StockListing;
