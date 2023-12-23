import { View, FlatList } from "react-native";
import React, { useState, useEffect, memo } from "react";

import { StockListingTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";

import { BaseApiService } from "../utils/BaseApiService";

import { StockingTabTitles } from "../constants/Constants";

const StockListing = memo(({ params, currentPage }) => {
  const [stockListing, setStockListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } = params;

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
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (
      currentPage === StockingTabTitles.ListingTitle &&
      stockListing.length === 0
    ) {
      fetchStockListing();
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
        data={stockListing}
        renderItem={({ item }) => <StockListingTransactionItem data={item} />}
      />
    </View>
  );
});

export default StockListing;
