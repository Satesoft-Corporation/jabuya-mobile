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
import { getFilterParams, getIsShopAttendant, getIsShopOwner, getSelectedShop } from "duqactStore/selectors";
import { hasInternetConnection } from "@utils/NetWork";
import DeleteSaleModal from "./components/DeleteSaleModal";
import Snackbar from "@components/Snackbar";
import SalesFilter from "./components/SalesFilter";
import { getCanViewSales, getCanViewShopCapital, getCanViewShopIncome } from "duqactStore/selectors/permissionSelectors";
import NoAuth from "@screens/Unauthorised";
import { CREDIT_SALE_ENDPOINT, SHOP_SALE_ENDPOINT } from "api";

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
  const [endDate, setEndDate] = useState(null);
  const [payments, setPayments] = useState([]);
  const [params, setParams] = useState(null);
  const [saleCapital, setSaleCapital] = useState([]); //capital list
  const [profits, setProfits] = useState([]); //profits list

  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);
  const isShopOwner = useSelector(getIsShopOwner);
  const isShopAttendant = useSelector(getIsShopAttendant);

  const canViewSales = useSelector(getCanViewSales);
  const canViewIncome = useSelector(getCanViewShopIncome);
  const canViewCapital = useSelector(getCanViewShopCapital);

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
    setEndDate(null);
    setSelectedLineItem(null);
    setSelectedSale(null);
  };

  const getDebtPayments = async (params) => {
    await new BaseApiService(CREDIT_SALE_ENDPOINT.PAYMENTS)
      .getRequestWithJsonResponse(params)
      .then((response) => {
        setPayments(response?.records);
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Cannot get sales!", error?.message);
      });
  };

  const getSales = async (params) => {
    setLoading(true);
    setMessage(null);
    setProfits([]);
    setSaleCapital([]);
    setSales([]);
    setTotalReords(0);

    const searchParameters = {
      offset: 0,
      limit: 100,
      ...filterParams,
      ...(!params && { startDate: getCurrentDay() }),
      ...(!params?.startDate && { startDate: getCurrentDay() }),
      ...(params && params),
    };

    setParams(params);

    if (searchParameters?.startDate) {
      setDate(searchParameters?.startDate);
    }

    if (searchParameters?.endDate) {
      setEndDate(searchParameters?.endDate);
    }

    if (!searchParameters?.endDate) {
      setEndDate(null);
    }

    const hasNet = await hasInternetConnection();

    if (hasNet === false) {
      setMessage("Cannot connect to the internet.");
      setLoading(false);
    } else {
      setIsFetchingMore(true);
      await getDebtPayments(searchParameters);

      await new BaseApiService(SHOP_SALE_ENDPOINT.GET_ALL)
        .getRequestWithJsonResponse(searchParameters)
        .then((response) => {
          if (response.totalItems === 0) {
            if (params?.userId) {
              setMessage(`No sale records found this shop user`);
            }
            setMessage(`No sale records found.`);
          }

          // setTotalReords(response?.totalItems);
          // setDaysProfit(Math.round(response?.totalProfit));
          // setDaysCapital(Math.round(response?.totalPurchaseCost));
          // setSalesValue(Math.round(response?.totalCost));

          const data = [...response.records].filter((sale) => sale?.balanceGivenOut >= 0); //to filter out credit sales

          let sV = data.reduce((a, sale) => a + sale?.totalCost, 0); //sales value

          data.forEach((item) => {
            const { lineItems } = item;
            if (lineItems !== undefined) {
              let cartProfit = lineItems.reduce((a, i) => a + i.totalProfit, 0);

              let cap = lineItems.reduce((a, i) => a + i.totalPurchaseCost, 0); // cart capital

              profits.push(cartProfit);
              saleCapital.push(cap);
            }
          });

          let income = profits.reduce((a, b) => a + b, 0); //getting the sum profit in all carts
          let capital = saleCapital.reduce((a, b) => a + b, 0);

          setDaysProfit(Math.round(income));
          setDaysCapital(Math.round(capital));
          setSalesValue(sV);
          setSales(response?.records);

          setTotalReords(response?.totalItems);
          setLoading(false);
          setIsFetchingMore(false);
        })
        .catch((error) => {
          setLoading(false);
          setMessage("Cannot get sales!", error?.message);
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getSales();
  }, [selectedShop]);

  if (!canViewSales) {
    return <NoAuth />;
  }
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
            {date && (
              <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: 600 }} onPress={() => setShowFilters(true)}>
                {formatDate(date, true)} {endDate && `to ${formatDate(endDate, true)}`}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", paddingHorizontal: 12 }}>
            <ItemHeader value={formatNumberWithCommas(sales?.length) || 0} title="Txns" />

            <VerticalSeparator />

            <ItemHeader title="Sales" value={formatNumberWithCommas(salesValue, selectedShop?.currency)} />

            {canViewCapital && (
              <>
                <VerticalSeparator />

                <ItemHeader title="Capital " value={formatNumberWithCommas(daysCapital, selectedShop?.currency)} />
              </>
            )}

            {canViewIncome && (
              <>
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
        data={[...sales, ...payments].sort((a, b) => b.id - a.id)}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item, i }) => (
          <SaleTxnCard
            key={i}
            data={item}
            print={() => print(item)}
            isShopAttendant={isShopAttendant}
            onDelete={() => {
              setSelectedLineItem(null);
              setSelectedSale(item);
              setDeleteModal(true);
            }}
            onSwipe={(lineItem) => {
              setSelectedSale(null);
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
