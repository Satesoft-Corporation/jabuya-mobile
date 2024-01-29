import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import { StockPurchaseTransactionItem } from "../components/TransactionItems";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";
import { Text } from "react-native";

const StockPurchase = memo(
  ({ params, searchTerm, currentPage, shouldSearch }) => {
    const [stockEntries, setStockEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [message, setMessage] = useState(null);

    const { PurchaseTitle } = StockingTabTitles;
    const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
      params;

    const search = currentPage === PurchaseTitle && shouldSearch === true;

    const fetchStockEntries = async () => {
      let searchParameters = {
        offset: 0,
        limit: 0,
      };
      if (search === true) {
        searchParameters.searchTerm = searchTerm;
      }

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
          if (response.totalItems === 0 && searchTerm !== "") {
            setMessage(`No results found for ${searchTerm}`);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };

    useEffect(() => {
      if (search === true) {
        setLoading(true);
        fetchStockEntries();
      }
    }, [shouldSearch]);

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
          renderItem={({ item }) => (
            <StockPurchaseTransactionItem data={item} />
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {totalRecords === 0 && (
                <Text>{message || "No purchases found."}</Text>
              )}
            </View>
          )}
        />
      </View>
    );
  }
);

export default StockPurchase;
