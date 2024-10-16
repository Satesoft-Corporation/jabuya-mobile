import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  convertDateFormat,
  convertToServerDate,
  formatDate,
  formatNumberWithCommas,
  getCurrentDay,
} from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import AppStatusBar from "@components/AppStatusBar";
import UserProfile from "@components/UserProfile";
import Colors from "@constants/Colors";
import ItemHeader from "./components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import SaleTxnCard from "./components/SaleTxnCard";
import { OFFLINE_SALES, SHOP_SUMMARY } from "@navigation/ScreenNames";
import DateTimePicker from "@react-native-community/datetimepicker";
import { printSale } from "@utils/PrintService";
import { useSelector } from "react-redux";
import {
  getFilterParams,
  getOfflineSales,
  getSelectedShop,
  getUserType,
} from "reducers/selectors";
import { SHOP_SALES_ENDPOINT } from "@utils/EndPointUtils";
import { userTypes } from "@constants/Constants";
import { hasInternetConnection } from "@utils/NetWork";

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

  const offlineSales = useSelector(getOfflineSales);
  const filterParams = useSelector(getFilterParams);
  const selectedShop = useSelector(getSelectedShop);
  const userType = useSelector(getUserType);

  const isShopOwner = userType === userTypes.isShopOwner;

  const navigation = useNavigation();

  const print = async (data) => {
    setLoading(true);
    await printSale(data);
    setLoading(false);
  };

  const menuItems = [
    {
      name: "Select date",
      onClick: () => setVisible(true),
    },

    ...(offlineSales?.length > 0
      ? [
          {
            name: "Offline sales",
            onClick: () => navigation.navigate(OFFLINE_SALES),
          },
        ]
      : []),
    ...(isShopOwner === true
      ? [
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
    getSales(convertToServerDate(selectedDate));
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

    const searchParameters = {
      offset: 0,
      limit: 0,
      ...filterParams,
      startDate: getCurrentDay(),
      ...(day && {
        startDate: convertDateFormat(day),
        endDate: convertDateFormat(day, true),
      }),
    };

    clearFields();
    const hasNet = await hasInternetConnection();
    if (hasNet === false) {
      setMessage("Cannot connect to the internet.");
      setLoading(false);
    } else {
      await new BaseApiService(SHOP_SALES_ENDPOINT)
        .getRequestWithJsonResponse(searchParameters)
        .then((response) => {
          const data = [...response.records].filter(
            (sale) => sale?.balanceGivenOut >= 0
          ); //to filter out credit sales

          if (response.totalItems === 0) {
            setMessage(`No sales made on this day for ${selectedShop?.name}`);
          }

          data.forEach((item) => {
            const { lineItems } = item;
            if (lineItems !== undefined) {
              let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
              setCount(cartQty);
            }
          });

          setDaysProfit(Math.round(response?.totalProfit));
          setDaysCapital(Math.round(response?.totalPurchaseCost));
          setSalesValue(Math.round(response?.totalCost));
          setSales(response?.records);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setMessage("Cannot get sales!", error?.message);
        });
    }
  };

  const setCount = (count) => {
    setTotalSalesQty((prevCount) => prevCount + count);
  };

  useEffect(() => {
    getSales();
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
            <ItemHeader
              value={formatNumberWithCommas(totalSalesQty) || 0}
              title="Qty"
            />

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
          <SaleTxnCard
            key={i}
            data={item}
            isShopOwner={isShopOwner}
            print={(data) => print(data)}
          />
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
