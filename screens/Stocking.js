import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, TouchableOpacity, Text } from "react-native";

import Colors from "../constants/Colors";
import {
  MAXIMUM_RECORDS_PER_FETCH,
  StockingTabTitles,
} from "../constants/Constants";

import AppStatusBar from "../components/AppStatusBar";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import { FloatingButton } from "../components/FloatingButton";

import StockPurchase from "./StockPurchase";
import StockLevel from "./StockLevels";
import StockListing from "./StockListing";
import SearchBar from "../components/SearchBar";
import { UserContext } from "../context/UserContext";
import { BaseApiService } from "../utils/BaseApiService";
import { SearchContext } from "../context/SearchContext";
import Loader from "../components/Loader";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import { areArraysEmpty } from "../utils/Utils";

const Stocking = ({ navigation }) => {
  const { PurchaseTitle, LevelsTitle, ListingTitle } = StockingTabTitles;
  const tabTitles = [PurchaseTitle, LevelsTitle, ListingTitle];

  const [loading, setLoading] = useState(true);

  const { userParams } = useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const {
    searchTerm,
    setSearchTerm,
    setShouldSearch,
    setCurrentTab,
    setStockEntries,
    setIsFetchingMore,
    setStockEntryRecords,
    setStockLevels,
    setStockLevelRecords,
    setMessage,
    stockListing,
    setStockListing,
    stockEntries,
    setStockListRecords,
    stockLevels,
  } = useContext(SearchContext);

  const searchParameters = {
    limit: MAXIMUM_RECORDS_PER_FETCH,
    ...(isShopAttendant && { shopId: attendantShopId }),
    ...(isShopOwner && { shopOwnerId }),
  };

  const fetchStockEntries = async (offsetValue = 0, searchTerm) => {
    try {
      setIsFetchingMore(true);
      const response = await new BaseApiService(
        "/stock-entries"
      ).getRequestWithJsonResponse({
        ...searchParameters,
        offset: offsetValue,
        ...(searchTerm &&
          searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      });

      setStockEntries((prevEntries) => [...prevEntries, ...response.records]);

      setStockEntryRecords(response.totalItems);
      if (response.totalItems === 0) {
        setMessage("No stock entries found");
      }

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
      setIsFetchingMore(false);
    } catch (error) {
      setLoading(false);

      setMessage("Error fetching stock records");
    }
  };

  const fetchStockLevels = async (offsetValue = 0, searchTerm) => {
    setIsFetchingMore(true);

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse({
        ...searchParameters,
        offset: offsetValue,
        ...(searchTerm &&
          searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      })
      .then(async (response) => {
        setStockLevels((prevEntries) => [...prevEntries, ...response.records]);

        setStockLevelRecords(response.totalItems);

        if (response.totalItems === 0) {
          setMessage("No stock records found for this shop.");
        }

        if (response.totalItems === 0 && searchTerm !== "") {
          setMessage(`No results found for ${searchTerm}`);
        }

        setIsFetchingMore(false);
      })
      .catch((error) => {
        setMessage("Error fetching records.");
        setLoading(false);
      });
  };

  const fetchStockListing = async (offsetValue = 0, searchTerm) => {
    try {
      setIsFetchingMore(true);
      const response = await new BaseApiService(
        "/shop-products"
      ).getRequestWithJsonResponse({
        ...searchParameters,
        offset: offsetValue,
        ...(searchTerm &&
          searchTerm.trim() !== "" && { searchTerm: searchTerm }),
      });

      setStockListing((prevEntries) => [...prevEntries, ...response.records]);

      setStockListRecords(response.totalItems);
      if (response.totalItems === 0) {
        setMessage("No stock entries found");
      }
      setLoading(false);

      if (response.totalItems === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
      setIsFetchingMore(false);
    } catch (error) {
      console.log(error);
      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  const pages = [
    {
      id: 0,
      page: (
        <StockPurchase getData={fetchStockEntries} setLoading={setLoading} />
      ),
    },
    {
      id: 1,
      page: <StockLevel getData={fetchStockLevels} setLoading={setLoading} />,
    },
    {
      id: 2,
      page: (
        <StockListing getData={fetchStockListing} setLoading={setLoading} />
      ),
    },
  ];
  const [currentPage, setCurrentPage] = useState(pages[0]);

  const handleFormDestination = (form) => {
    navigation.navigate(form, { ...userParams });
    return true;
  };

  const fetchStock = () => {
    fetchStockEntries();
    fetchStockLevels();
    fetchStockListing();
  };

  useEffect(() => {
    setSearchTerm("");
    setStockEntries([]);
    setStockLevels([]);
    setStockListing([]);
    fetchStock();
  }, []);

  return (
    <FloatingButton
      handlePress={handleFormDestination}
      isAttendant={userParams.isShopAttendant}
      currentPage={currentPage}
    >
      <OrientationLoadingOverlay
        visible={loading}
        color={Colors.primary}
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

        <BlackScreen flex={0.4}>
          <UserProfile navigation={navigation} />

          <SearchBar
            value={searchTerm}
            onChangeText={(text) => {
              setShouldSearch(false);
              setSearchTerm(text);
            }}
            onSearch={() => {
              setShouldSearch(true);
            }}
          />

          <View
            style={{
              flexDirection: "row",
            }}
          >
            {tabTitles.map((title, index) => {
              const isFocused = currentPage.id === index;

              const onPress = () => {
                setShouldSearch(false);
                setCurrentTab(tabTitles[index]);
                setCurrentPage(pages[index]);
              };

              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderBottomWidth: 2,
                    borderBottomColor: isFocused
                      ? Colors.primary
                      : "transparent",
                    opacity: isFocused ? 1 : 0.6,
                  }}
                >
                  <Text
                    style={{
                      color: isFocused ? Colors.primary : Colors.light,
                      paddingBottom: 8,
                      paddingTop: 8,
                    }}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlackScreen>

        {currentPage.page}
      </View>
    </FloatingButton>
  );
};

export default Stocking;
