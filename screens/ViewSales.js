import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

import { BaseApiService } from "../utils/BaseApiService";

import Colors from "../constants/Colors";

import AppStatusBar from "../components/AppStatusBar";
import { convertDateFormat, formatNumberWithCommas, getCurrentDay } from "../utils/Utils";
import UserProfile from "../components/UserProfile";
import { SaleTransactionItem } from "../components/TransactionItems";
import Loader from "../components/Loader";
import { DateCalender } from "../components/Dialogs/DateCalendar";

export default function ViewSales({ navigation, route }) {
  const [sales, setSales] = useState([]); // sales got from the server
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [salesValue, setSalesValue] = useState(0);
  const [searchPeriod, setSearchPeriod] = useState("Today");

  const {
    isShopOwner,
    isShopAttendant,
    attendantShopId,
    shopOwnerId,
    myShopId,
  } = route.params;

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

  function getProfit() {
    return formatNumberWithCommas(3720800);
  }

  const getSales = async (startDate, endDate) => {
    let searchParameters = {
      offset: offset,
      limit: 0,
    };

    setLoading(true);
    setSalesValue(0);
    setTotalSales(0);

    if (!startDate && !endDate) {
      searchParameters.startDate = getCurrentDay();
    }

    if (startDate) {
      searchParameters.startDate = convertDateFormat(startDate);
    }

    if (endDate) {
      searchParameters.endDate = convertDateFormat(endDate, true);
    }
    if (endDate === null && startDate) {
      //specific day setting
      searchParameters.endDate = convertDateFormat(startDate, true);
      // if (formatDateToDDMMYY(startDate) === formatDateToDDMMYY(getCurrentDay())){
      //   console.log('same dates')
      // }
    }
    if (isShopOwner) {
      searchParameters.shopOwnerId = shopOwnerId;
    }
    if (isShopAttendant) {
      searchParameters.shopId = attendantShopId;
    }
    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        for (let item of response?.records) {
          setSalesValue((i) => i + item.totalCost);
        }
        setSales(response?.records);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((error) => {
        Alert.alert("Cannot get sales!", error?.message);
        console.log(error, "bksvbsvbsvhbsvj");
        setLoading(false);
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
    setTotalSales((prevCount) => prevCount + count);
  };

  useEffect(() => {
    getSales();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <Loader loading={loading} />

      <AppStatusBar bgColor="black" content="light-content" />

      <View style={{ flex: 1.2, backgroundColor: "black" }}>
        <UserProfile />
        <View style={{ flex: 0.8, marginTop: 5 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Sales summary
              </Text>
              {/* <Text
                style={{
                  color: Colors.primary,
                  fontSize: 16,
                  fontWeight: 400,
                  marginTop: 3,
                }}
              >
                Period : {searchPeriod}
              </Text> */}
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity onPress={handleRefresh}>
                <Image
                  source={require("../assets/icons/icons8-refresh-50.png")}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: Colors.primary,
                    marginEnd: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Image
                  source={require("../assets/icons/icons8-calendar-26.png")}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: Colors.primary,
                    marginEnd: 10,
                  }}
                />
              </TouchableOpacity>
              {isShopAttendant !== true && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    borderRadius: 3,
                    height: 25,
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    navigation.navigate("shopSummary", {
                      isShopOwner,
                      isShopAttendant,
                      attendantShopId,
                      shopOwnerId,
                      myShopId,
                    })
                  }
                >
                  <Text
                    style={{
                      color: Colors.dark,
                      paddingHorizontal: 6,
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    Investment
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <ItemHeader value={totalSales || 0} title="Qty" ugx={false} />
            <View
              style={{
                width: 1,
                height: "inherit",
                backgroundColor: Colors.primary,
              }}
            />
            <ItemHeader
              title="Sales"
              value={formatNumberWithCommas(salesValue)}
            />
            <View
              style={{
                width: 1,
                height: "inherit",
                backgroundColor: Colors.primary,
              }}
            />
            <ItemHeader
              title="Capital "
              value={formatNumberWithCommas(500000)}
            />
            <View
              style={{
                width: 1,
                height: "inherit",
                backgroundColor: Colors.primary,
              }}
            />
            <ItemHeader title="Profit" value={getProfit()} />
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: Colors.light_2, flex: 3 }}>
        <View
          style={{
            flex: 3,
            paddingBottom: 20,
          }}
        >
          <View style={{ marginTop: 1, flex: 1 }}>
            {sales.length > 0 ? (
              <FlatList
                containerStyle={{ padding: 5 }}
                showsHorizontalScrollIndicator={false}
                data={sales}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, i }) => (
                  <SaleTransactionItem
                    key={i}
                    data={item}
                    setCount={(a) => setCount(a)}
                    isShopOwner={isShopOwner}
                  />
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  No sales made on this today
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <DateCalender
        selectedEndDate={selectedEndDate}
        visible={visible}
        selectedStartDate={selectedStartDate}
        handleDayPress={handleDayPress}
        setFiltering={setFiltering}
        setVisible={setVisible}
        onFinish={filterSales}
        setSelectedEndDate={setSelectedEndDate}
        setSelectedStartDate={setSelectedStartDate}
        moreCancelActions={() => {}}
      />
    </View>
  );
}

export function ItemHeader({ title, value, ugx = true }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          fontSize: 12,
          color: Colors.primary,
          alignSelf: "flex-start",
          opacity: 0.6,
          marginBottom: 3,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontSize: 15, color: Colors.primary, fontWeight: "600" }}>
        {ugx && (
          <Text
            style={{
              fontSize: 10,
            }}
          >
            UGX
          </Text>
        )}{" "}
        {value}
      </Text>
    </View>
  );
}
