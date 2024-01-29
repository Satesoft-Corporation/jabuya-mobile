import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import { StockListingTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import Colors from "../constants/Colors";
import { Text } from "react-native";

const StockListing = memo(
  ({ params, searchTerm, currentPage, shouldSearch }) => {
    const [stockListing, setStockListing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(null);

    const { ListingTitle } = StockingTabTitles;
    const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
      params;
    const search = currentPage === ListingTitle && shouldSearch === true;

    const fetchStockListing = async () => {
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
      fetchStockListing();
    }, []);

    useEffect(() => {
      if (search === true) {
        setLoading(true);
        fetchStockListing();
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
          data={stockListing}
          renderItem={({ item }) => <StockListingTransactionItem data={item} />}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {totalRecords === 0 && <Text>No products listed yet.</Text>}
            </View>
          )}
        />
      </View>
    );
  }
);

export default StockListing;
