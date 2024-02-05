import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo, useContext } from "react";

import { StockPurchaseTransactionItem } from "../components/TransactionItems";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";
import { Text } from "react-native";
import { SearchContext } from "../context/SearchContext";

const StockPurchase = ({ route }) => {
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [message, setMessage] = useState(null);

  const { PurchaseTitle } = StockingTabTitles;
  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    route.params;
  const { searchTerm, shouldSearch, currentTab } = useContext(SearchContext);

  const search = currentTab === PurchaseTitle && shouldSearch === true;

  const fetchStockEntries = async () => {
    let searchParameters = {
      offset: 0,
      limit: 6,
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
      console.log(search, route.name);
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
        renderItem={({ item }) => <StockPurchaseTransactionItem data={item} />}
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
};

export default StockPurchase;
