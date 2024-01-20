import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import { StockLevelTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";

const StockLevel = memo(
  ({ params, currentPage, searchTerm, setShowLoading }) => {
    const [stockLevels, setStockLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    const { LevelsTitle } = StockingTabTitles;
    const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
      params;

    const fetchStockLevels = async () => {
      setLoading(true);
      let searchParameters = {
        offset: 0,
        limit: 0,
      };

      if (searchTerm) {
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
          setShowLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchStockLevels();
    }, []);

    useEffect(() => {
      if (currentPage === LevelsTitle && searchTerm !== "") {
        fetchStockLevels();
      }
    }, [searchTerm]);

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
          data={stockLevels}
          renderItem={({ item }) => (
            <StockLevelTransactionItem
              data={item}
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
          )}
        />
      </View>
    );
  }
);

export default StockLevel;
