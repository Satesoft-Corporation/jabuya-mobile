import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import { StockListingTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";

const StockListing = memo(
  ({ params, searchTerm, currentPage, setShowLoading }) => {
    const [stockListing, setStockListing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

    const { ListingTitle } = StockingTabTitles;
    const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
      params;

    const fetchStockListing = async () => {
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
          setShowLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchStockListing();
    }, []);

    useEffect(() => {
      if (currentPage === ListingTitle && searchTerm !== "") {
        fetchStockListing();
      }
    }, [searchTerm]);

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
          renderItem={({ item }) => (
            <StockListingTransactionItem
              data={item}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No listing found.</Text>
                </View>
              )}
            />
          )}
        />
      </View>
    );
  }
);

export default StockListing;
