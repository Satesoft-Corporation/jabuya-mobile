import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import { StockPurchaseTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";

const StockPurchase = memo(({ params, currentPage }) => {
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
    if (
      currentPage === StockingTabTitles.PurchaseTitle &&
      stockEntries.length === 0
    ) {
      fetchStockEntries();
    }
  }, [currentPage]);

  return (
    <View
      style={{
        justifyContent: "center",
      }}
    >
      <Loader visible={loading} />
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
