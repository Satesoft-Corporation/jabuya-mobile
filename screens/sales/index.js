import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { formatDate, formatNumberWithCommas, getCurrentDay } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import UserProfile from "@components/UserProfile";
import Colors from "@constants/Colors";
import ItemHeader from "./components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import SaleTxnCard from "./components/SaleTxnCard";
import { SHOP_SUMMARY } from "@navigation/ScreenNames";
import { printSale } from "@utils/PrintService";
import { useSelector } from "react-redux";
import { getFilterParams, getSelectedShop, getUserType } from "reducers/selectors";
import { SHOP_SALES_ENDPOINT } from "@utils/EndPointUtils";
import { MAXIMUM_RECORDS_PER_FETCH, userTypes } from "@constants/Constants";
import { hasInternetConnection } from "@utils/NetWork";
import DeleteSaleModal from "./components/DeleteSaleModal";
import Snackbar from "@components/Snackbar";
import SalesFilter from "./components/SalesFilter";
import Icon from "@components/Icon";

export default function ViewSales() {
  const [sales, setSales] = useState([]);
  const [salesValue, setSalesValue] = useState(0); //total money value sold
  const [daysProfit, setDaysProfit] = useState(0);
  const [daysCapital, setDaysCapital] = useState(0);
  const [totalRecords, setTotalReords] = useState(0);
  const [currentParams, setCurrentParams] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedLineItem, setSelectedLineItem] = useState(null);

  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);
  const userType = useSelector(getUserType);

  const isShopOwner = userType === userTypes.isShopOwner;
  const isShopAttendant = userType === userTypes.isShopAttendant;
  const snackbarRef = useRef(null);

  const navigation = useNavigation();

  const print = async (data) => {
    setLoading(true);
    await printSale(data);
    setLoading(false);
  };

  const clearFields = () => {
    //reseting calculatable fields
    setSales([]);
    setSalesValue(0);
    setDaysCapital(0);
    setDaysProfit(0);
    setMessage(null);
    setDate(new Date());
    setSelectedLineItem(null);
    setSelectedSale(null);
  };

  const getSales = async (params) => {
    setLoading(true);
    setMessage(null);

    const searchParameters = {
      offset: 0,
      limit: 0,
      ...filterParams,
      ...(!params && { startDate: getCurrentDay() }),
      ...(!params?.startDate && !params?.shopProductId && !params?.userId && { startDate: getCurrentDay() }),
      ...(params && params),
    };

    if (!searchParameters?.startDate) {
      setDate(null);
    }
    // console.log(searchParameters);
    const hasNet = await hasInternetConnection();

    if (hasNet === false) {
      setMessage("Cannot connect to the internet.");
      setLoading(false);
    } else {
      setIsFetchingMore(true);

      await new BaseApiService(SHOP_SALES_ENDPOINT)
        .getRequestWithJsonResponse(searchParameters)
        .then((response) => {
          if (response.totalItems === 0) {
            setMessage(`No sale records found.`);
          }
          setTotalReords(response?.totalItems);
          setDaysProfit(Math.round(response?.totalProfit));
          setDaysCapital(Math.round(response?.totalPurchaseCost));
          setSalesValue(Math.round(response?.totalCost));
          setSales(response?.records);
          setLoading(false);
          setIsFetchingMore(false);
        })
        .catch((error) => {
          setLoading(false);
          setMessage("Cannot get sales!", error?.message);
        });
    }
  };

  useEffect(() => {
    getSales();
  }, [selectedShop]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <DeleteSaleModal
        selectedSale={selectedSale}
        showMoodal={deleteModal}
        setShowModal={setDeleteModal}
        selectedLineItem={selectedLineItem}
        onComplete={() => {
          snackbarRef.current.show("Details saved");
          clearFields();
          getSales();
        }}
      />

      <SalesFilter showFilters={showFilters} setShowFilters={setShowFilters} getSales={getSales} setDate={setDate} />

      <View style={{ backgroundColor: Colors.dark }}>
        <UserProfile
          renderNtnIcon={false}
          renderMenu={isShopOwner === true}
          menuItems={[{ name: "Investment", onClick: () => navigation.navigate(SHOP_SUMMARY) }]}
          filter
          setShowFilters={setShowFilters}
        />

        <View style={{ marginTop: 5, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, marginVertical: 10, alignItems: "center" }}>
            <View style={{ gap: 2 }}>
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: 600 }}>Sales summary</Text>
            </View>
            {date && <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: 600 }}>{formatDate(date, true)}</Text>}
          </View>

          <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", paddingHorizontal: 12 }}>
            <ItemHeader value={formatNumberWithCommas(sales?.length) || 0} title="Txns" />

            <VerticalSeparator />

            <ItemHeader title="Sales" value={formatNumberWithCommas(salesValue, selectedShop?.currency)} />

            {!isShopAttendant && (
              <>
                <VerticalSeparator />

                <ItemHeader title="Capital " value={formatNumberWithCommas(daysCapital, selectedShop?.currency)} />

                <VerticalSeparator />

                <ItemHeader title="Income" value={formatNumberWithCommas(daysProfit, selectedShop?.currency)} />
              </>
            )}
          </View>
        </View>
      </View>

      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={sales}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item, i }) => (
          <SaleTxnCard
            key={i}
            data={item}
            print={() => print(item)}
            isShopAttendant={isShopAttendant}
            onDelete={() => {
              setSelectedSale(item);
              setDeleteModal(true);
            }}
            onSwipe={(lineItem) => {
              console.log(lineItem?.item);
              setSelectedLineItem(lineItem?.item);
              setDeleteModal(true);
            }}
          />
        )}
        ListEmptyComponent={() => <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>{message}</Text>}
        onRefresh={() => {
          clearFields();
          getSales();
        }}
        refreshing={loading}
      />

      <Snackbar ref={snackbarRef} />
    </SafeAreaView>
  );
}
