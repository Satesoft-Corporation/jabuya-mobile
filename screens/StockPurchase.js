import { View, FlatList, Text } from "react-native";
import React, { useState, useEffect, memo } from "react";
import { StockPurchaseTransactionItem } from "../components/TransactionItems";
import { BaseApiService } from "../utils/BaseApiService";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";

const StockPurchase = memo(({ params }) => {
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } = params;

  const fetchStockEntries = async () => {
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

    new BaseApiService("/stock-entries")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setStockEntries(response.records);
        setTotalRecords(response.totalItems);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchStockEntries();
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
        keyExtractor={(item) => item.id}
        data={stockEntries}
        renderItem={({ item }) => <StockPurchaseTransactionItem data={item} />}
      />
    </View>
  );
});

export default StockPurchase;
