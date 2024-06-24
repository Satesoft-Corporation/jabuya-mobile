import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { userData } from "context/UserContext";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { convertDateFormat, formatDate, getCurrentDay } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import AppStatusBar from "@components/AppStatusBar";
import UserProfile from "@components/UserProfile";
import Colors from "@constants/Colors";
import ItemHeader from "./components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import SaleTxnCard from "./components/SaleTxnCard";
import { OFFLINE_SALES, SHOP_SUMMARY } from "@navigation/ScreenNames";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ViewSales() {
  const [sales, setSales] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSalesQty, setTotalSalesQty] = useState(0); //total quantity for all sold items
  const [visible, setVisible] = useState(false);
  const [salesValue, setSalesValue] = useState(0); //total money value sold
  const [saleCapital, setSaleCapital] = useState([]); //capital list
  const [profits, setProfits] = useState([]); //profits list
  const [daysProfit, setDaysProfit] = useState(0);
  const [daysCapital, setDaysCapital] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offlineSales, setOfflineSales] = useState(false);

  const navigation = useNavigation();
  const { userParams, selectedShop, filterParams } = userData();

  const { isShopOwner } = userParams;

  const unsavedSales = async () => {
    let list = await UserSessionUtils.getPendingSales();
    setOfflineSales(list?.length > 0);
  };

  const menuItems = [
    {
      name: "Select date",
      onClick: () => setVisible(true),
    },

    ...(offlineSales === true
      ? [
          {
            name: "Offline sales",
            onClick: () => navigation.navigate(OFFLINE_SALES),
          },
        ]
      : []),
    ...(isShopOwner === true
      ? [
          // {
          //   name: "Income graphs",
          //   onClick: () => navigation.navigate(INCOME_GRAPHS),
          // },
          {
            name: "Investment",
            onClick: () => navigation.navigate(SHOP_SUMMARY),
          },
        ]
      : []),
  ];

  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    setVisible(false);
    getSales(selectedDate);
    setDate(selectedDate);
  };

  const clearFields = () => {
    //reseting calculatable fields
    setSales([]);
    setSalesValue(0);
    setTotalSalesQty(0);
    setProfits([]);
    setSaleCapital([]);
    setDaysCapital(0);
    setDaysProfit(0);
    setMessage(null);
    setTotalItems(0);
    setDate(new Date());
  };

  const getSales = async (day = null) => {
    setLoading(true);
    setMessage(null);

    let searchParameters = {
      offset: 0,
      limit: 0,
      ...filterParams(),
      startDate: getCurrentDay(),
      ...(day && {
        startDate: convertDateFormat(day),
        endDate: convertDateFormat(day),
      }),
    };

    clearFields();

    await new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        const data = [...response.records].filter(
          (sale) => sale?.balanceGivenOut >= 0
        ); //to filter out credit sales

        let sV = data.reduce((a, sale) => a + sale?.totalCost, 0); //sales value

        if (response.totalItems === 0) {
          setMessage(`No sales made on this day for ${selectedShop?.name}`);
        }

        data.forEach((item) => {
          const { lineItems } = item;
          if (lineItems !== undefined) {
            let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);

            let cartProfit = lineItems.reduce((a, i) => a + i.totalProfit, 0);

            let cap = lineItems.reduce((a, i) => a + i.totalPurchaseCost, 0); // cart capital

            profits.push(cartProfit);
            saleCapital.push(cap);

            setCount(cartQty);
          }
        });

        let income = profits.reduce((a, b) => a + b, 0); //getting the sum profit in all carts
        let capital = saleCapital.reduce((a, b) => a + b, 0);

        setDaysProfit(Math.round(income));
        setDaysCapital(Math.round(capital));
        setSalesValue(sV);
        setSales(response?.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Cannot get sales!", error?.message);
      });
  };

  const setCount = (count) => {
    setTotalSalesQty((prevCount) => prevCount + count);
  };

  useEffect(() => {
    getSales();
    unsavedSales();
  }, [selectedShop]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <View style={{ backgroundColor: Colors.dark }}>
        <UserProfile
          renderNtnIcon={false}
          renderMenu
          menuItems={menuItems}
          showShops
        />

        <View style={{ marginTop: 5, paddingBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Sales summary
            </Text>
            <Text
              style={{
                color: Colors.primary,
                fontSize: 13,
                fontWeight: 600,
                alignSelf: "flex-end",
              }}
            >
              {formatDate(date, true)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <ItemHeader value={totalSalesQty || 0} title="Qty" />

            <VerticalSeparator />

            <ItemHeader title="Sales" value={salesValue} isCurrency />

            <VerticalSeparator />

            <ItemHeader title="Capital " value={daysCapital} isCurrency />

            <VerticalSeparator />

            <ItemHeader title="Income" value={daysProfit} isCurrency />
          </View>
        </View>
      </View>

      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, i }) => (
          <SaleTxnCard key={i} data={item} isShopOwner={isShopOwner} />
        )}
        ListEmptyComponent={() => (
          <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>
            {message}
          </Text>
        )}
        onRefresh={() => getSales()}
        refreshing={loading}
      />

      {visible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
