import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import AppStatusBar from "../../../components/AppStatusBar";
import TopHeader from "../../../components/TopHeader";
import { MenuIcon } from "../../../components/MenuIcon";
import { BaseApiService } from "../../../utils/BaseApiService";
import CreditSaleListItem from "../components/CreditSaleListItem";
import Snackbar from "../../../components/Snackbar";
import { MAXIMUM_RECORDS_PER_FETCH } from "../../../constants/Constants";
import Colors from "../../../constants/Colors";
import { ActivityIndicator } from "react-native";
import { UserContext } from "../../../context/UserContext";

const CreditSales = () => {
  const [creditSales, setCreditSales] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);

  const snackbarRef = useRef(null);

  const { userParams, reload, setReload } = useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const fetchCreditSales = async () => {
    let searchParameters = {
      limit: MAXIMUM_RECORDS_PER_FETCH,
      ...(isShopAttendant && { shopId: attendantShopId }),
      ...(isShopOwner && { shopOwnerId }),
      offset: reload === true ? 0 : offset,
      ...(searchTerm && searchTerm.trim() !== "" && { searchTerm: searchTerm }),
    };

    setCreditSales([]);
    setShowFooter(true);

    setIsFetchingMore(true);

    new BaseApiService("/credit-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setCreditSales((prevEntries) => [...prevEntries, ...response?.records]);

        setTotalRecords(response.totalItems);

        if (response?.totalItems === 0) {
          setMessage("No shop products found");
          setShowFooter(false);
        }

        if (response?.totalItems === 0 && searchTerm !== "") {
          setMessage(`No results found for ${searchTerm}`);
          setShowFooter(false);
        }
        setIsFetchingMore(false);
      })
      .catch((error) => {
        setShowFooter(false);
        setMessage("Error fetching credit records");
      });
  };

  useEffect(() => {
    fetchCreditSales();
    if (reload === true) {
      snackbarRef.current.show("Payment saved succesfully");
    }
  }, [offset, reload]);

  const renderFooter = () => {
    if (showFooter === true) {
      if (creditSales.length === totalRecords && creditSales.length > 0) {
        return null;
      }

      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating size="large" color={Colors.dark} />
        </View>
      );
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && creditSales.length < totalRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (creditSales.length === totalRecords && creditSales.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader title="Credited Records" />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={creditSales}
          renderItem={({ item }) => <CreditSaleListItem sale={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{message}</Text>
            </View>
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0}
          ListFooterComponent={renderFooter}
        />
        <Snackbar ref={snackbarRef} />
      </View>
    </View>
  );
};

export default CreditSales;
