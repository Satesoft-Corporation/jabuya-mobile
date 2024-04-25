import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { BaseApiService } from "../../utils/BaseApiService";

import Colors from "../../constants/Colors";

import AppStatusBar from "../../components/AppStatusBar";
import {
  convertDateFormat,
  formatNumberWithCommas,
  getCurrentDay,
} from "../../utils/Utils";
import UserProfile from "../../components/UserProfile";
import { DateCalender } from "../../components/Dialogs/DateCalendar";
import { UserContext } from "../../context/UserContext";
import { ActivityIndicator } from "react-native";
import { SaleTransactionItem } from "./components/SaleTransactionItem";
import ItemHeader from "./components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";
import { SHOP_SUMMARY } from "../../navigation/ScreenNames";

export default function ViewSales({ navigation }) {
  const [sales, setSales] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSalesQty, setTotalSalesQty] = useState(0); //total quantity for all sold items
  const [visible, setVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [salesValue, setSalesValue] = useState(0); //total money value sold
  const [saleCapital, setSaleCapital] = useState([]); //capital list
  const [profits, setProfits] = useState([]); //profits list
  const [daysProfit, setDaysProfit] = useState(0);
  const [daysCapital, setDaysCapital] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userParams, shops, selectedShop, setSelectedShop } =
    useContext(UserContext);

  const { isShopOwner, shopOwnerId } = userParams;

  const menuItems = [
    {
      name: "Refresh",
      onClick: () => handleRefresh(),
    },
    {
      name: "Select date range",
      onClick: () => setVisible(true),
    },
    isShopOwner && {
      name: "Investment",
      onClick: () => navigation.navigate(SHOP_SUMMARY),
    },
    ...(shops?.length > 1
      ? shops?.map((shop) => {
          return {
            ...shop,
            onClick: () => setSelectedShop(shop),
            bold: shop?.id === selectedShop.id,
          };
        })
      : []),
  ];

  const idObject =
    selectedShop?.id === shopOwnerId
      ? {
          shopOwnerId: selectedShop?.id,
        }
      : {
          shopId: selectedShop?.id,
        };

  const handleDayPress = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else if (
      selectedStartDate &&
      !selectedEndDate &&
      day.dateString !== selectedStartDate
    ) {
      setSelectedEndDate(day.dateString);
    } else {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(day.dateString); // Set both start and end dates to the single selected date
    }
  };

  const handleRefresh = () => {
    setSelectedEndDate(null);
    setSelectedStartDate(null);
    getSales();
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
  };

  const getSales = async (startDate, endDate) => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      ...idObject,
      ...(!startDate && !endDate && { startDate: getCurrentDay() }),
      ...(startDate && { startDate: convertDateFormat(startDate) }),
      ...(endDate && { endDate: convertDateFormat(endDate, true) }),
      ...(endDate === null &&
        startDate && { endDate: convertDateFormat(startDate, true) }),
    };

    clearFields();
    setLoading(true);
    setMessage(null);

    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        const data = [...response.records].filter(
          (sale) => sale?.balanceGivenOut >= 0
        ); //to filter out credit sales

        let sV = data.reduce((a, sale) => a + sale?.totalCost, 0); //sales value

        if (response.totalItems === 0) {
          setMessage("No sales made on this today");
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

        setDaysProfit(formatNumberWithCommas(Math.round(income)));
        setDaysCapital(formatNumberWithCommas(Math.round(capital)));
        setSalesValue(sV);
        setSales(response?.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Cannot get sales!", error?.message);
      });
  };

  const filterSales = () => {
    let startDate = selectedStartDate ? new Date(selectedStartDate) : null;
    let endDate = selectedEndDate ? new Date(selectedEndDate) : null;
    if (startDate > endDate && endDate) {
      // if the start date is greater than the end date
      [startDate, endDate] = [endDate, startDate]; // Swap the dates using destructuring assignment
    }
    getSales(startDate, endDate);
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
        <UserProfile renderNtnIcon={false} renderMenu menuItems={menuItems} />

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
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              {selectedShop?.name}
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
            <ItemHeader value={totalSalesQty || 0} title="Qty" ugx={false} />

            <VerticalSeparator />

            <ItemHeader
              title="Sales"
              value={formatNumberWithCommas(salesValue)}
            />

            <VerticalSeparator />

            <ItemHeader title="Capital " value={daysCapital} />

            <VerticalSeparator />

            <ItemHeader title="Income" value={daysProfit} />
          </View>
        </View>
      </View>

      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, i }) => (
          <SaleTransactionItem key={i} data={item} isShopOwner={isShopOwner} />
        )}
        ListEmptyComponent={() => (
          <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>
            {message}
          </Text>
        )}
        onRefresh={() => handleRefresh()}
        refreshing={loading}
      />

      <DateCalender
        selectedEndDate={selectedEndDate}
        visible={visible}
        selectedStartDate={selectedStartDate}
        handleDayPress={handleDayPress}
        setVisible={setVisible}
        onFinish={filterSales}
        setSelectedEndDate={setSelectedEndDate}
        setSelectedStartDate={setSelectedStartDate}
        moreCancelActions={() => {}}
      />
    </SafeAreaView>
  );
}
