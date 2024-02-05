import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo, useContext } from "react";

import { StockLevelTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";
import { Text } from "react-native";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";
import { SearchContext } from "../context/SearchContext";

const StockLevel = memo(({ route }) => {
  const [stockLevels, setStockLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const { searchTerm, shouldSearch ,currentTab} = useContext(SearchContext);

  const { LevelsTitle } = StockingTabTitles;
  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } = route.params;

  const search = currentTab === LevelsTitle && shouldSearch === true;

  const fetchStockLevels = async () => {
    setLoading(true);
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
    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setStockLevels(response.records);
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

  useEffect(() => {
    if (search === true) {
      console.log(search, route.name);

      setLoading(true);
      fetchStockLevels();
    }
  }, [shouldSearch]);

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
        data={stockLevels}
        renderItem={({ item }) => <StockLevelTransactionItem data={item} />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>No stock records found.</Text>
          </View>
        )}
      />
    </View>
  );
});

export default StockLevel;
