import { View, Text, Alert, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { BaseApiService } from "../utils/BaseApiService";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import { Calendar } from "react-native-calendars";
import MaterialButton from "../components/MaterialButton";
import ModalContent from "../components/ModalContent";
import { formatNumberWithCommas } from "../utils/Utils";
import { Image } from "react-native";
import UserProfile from "../components/UserProfile";

const tableHead = ["Item", "Price", "Qty", "Amount"];

export default function ViewSales({ navigation, route }) {
  const [sales, setSales] = useState([]); // sales got from the server
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [allSales, setAllSales] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [initialCapital, setInitialCapital] = useState(null);
  const [salesValue, setSalesValue] = useState(0);

  const calendarTheme = {
    calendarBackground: "black",
    arrowColor: Colors.primary,
    todayTextColor: Colors.primary,
    monthTextColor: Colors.light,
    selectedDayBackgroundColor: Colors.primary,
    textDisabledColor: Colors.gray, //other months dates
    textSectionTitleColor: Colors.light, // days
    dayTextColor: Colors.light,
    selectedDayTextColor: "black",
  };

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

  function compareDates(date1, date2) {
    const formattedDate1 = new Date(date1).toISOString().slice(0, 10);
    const formattedDate2 = new Date(date2).toISOString().slice(0, 10);

    return formattedDate1 === formattedDate2;
  }

  function convertDateFormat(dateString, getTomorrowDate = false) {
    const date = new Date(dateString); // Create a Date object from the input string

    if (getTomorrowDate === true) {
      date.setDate(date.getDate() + 1); // Increment the date by 1 to get tomorrow's date
    }

    const isoDateString = date.toISOString(); // Convert Date object to ISO string
    return isoDateString;
  }

  function getProfit() {
    if (performanceSummary && initialCapital) {
      let profits = performanceSummary.totalSalesValue - initialCapital;

      return profits > 0 ? formatNumberWithCommas(profits) : 0;
    }
    return 0;
  }
  let id = isShopAttendant ? attendantShopId : isShopOwner ? myShopId : id;

  function getCurrentDay(getTomorrowDate = false) {
    const now = new Date();
    if (getTomorrowDate === true) {
      now.setDate(now.getDate() - 1);
    }
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    let hours = "00";
    let minutes = "00";
    let seconds = "00";
    let milliseconds = "00";

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  const fetchSumarry = () => {
    new BaseApiService(`/shops/${id}`)
      .getRequestWithJsonResponse()
      .then((response) => {
        setInitialCapital(response.data.initialCapital);
        setPerformanceSummary(response.data.performanceSummary);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((error) => {
        Alert.alert("Cannot get summary!", error?.message);
        setLoading(false);
      });
  };

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
        setAllSales(response.records);
        for (let item of response.records) {
          setTotalSales((i) => i + item.lineItems.length);
          setSalesValue((i) => i + item.amountPaid);
        }
        setSales(response.records);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((error) => {
        Alert.alert("Cannot get sales!", error?.message);
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

  useEffect(() => {
    getSales();
    fetchSumarry();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <OrientationLoadingOverlay
        visible={loading}
        color={Colors.primary}
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
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
                  alignSelf: "center",
                  marginTop: 8,
                }}
              >
                Day's sales
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
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
              value={initialCapital && formatNumberWithCommas(initialCapital)}
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
            // backgroundColor: Colors.light_2,
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
                renderItem={({ item }) => <TransactionItem data={item} />}
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

      <ModalContent visible={visible} style={{ padding: 10 }}>
        <Calendar
          theme={calendarTheme}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedStartDate]: {
              selected: true,
              startingDay: true,
              endingDay: selectedEndDate === selectedStartDate,
            },
            [selectedEndDate]: {
              selected: true,
              endingDay: true,
            },
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 15,
          }}
        >
          <MaterialButton
            title="Cancel"
            style={{
              backgroundColor: "transparent",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.dark,
              marginStart: -2,
              margin: 10,
              height: 40,
            }}
            titleStyle={{
              fontWeight: "bold",
              color: Colors.dark,
            }}
            buttonPress={() => {
              setVisible(false);
              setSelectedEndDate(null);
              setSelectedStartDate(null);
            }}
          />
          <MaterialButton
            title="Apply"
            style={{
              backgroundColor: Colors.dark,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.dark,
              marginStart: 2,
              marginEnd: -2,
              margin: 10,
              height: 40,
            }}
            titleStyle={{
              fontWeight: "bold",
              color: Colors.primary,
            }}
            buttonPress={() => {
              setFiltering(true);
              setVisible(false);
              filterSales();
              setSelectedEndDate(null);
              setSelectedStartDate(null);
            }}
            disabled={!selectedStartDate && !selectedEndDate}
          />
        </View>
      </ModalContent>
    </View>
  );
}

function TransactionItem({ data }) {
  function formatDate(inputDate) {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(inputDate);

    // Format the date
    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const { lineItems, totalCost, amountPaid, balanceGivenOut } = data;

  const [expanded, setExpanded] = useState(false);
  const [list, setList] = useState([]); //to be rendered in the table
  const [itemCount, setItemCount] = useState(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    if (lineItems !== undefined) {
      if (list.length === 0) {
        for (let item of lineItems) {
          list.push([
            item.shopProductName,
            item.unitCost,
            item.quantity,
            item.totalCost,
          ]);
          setItemCount((count) => count + item.quantity);
        }
      }
    }
  }, []);
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: Colors.dark,
            marginBottom: 2,
          }}
        >
          Txn ID: {data.id}
        </Text>

        <View>
          <Text
            style={{
              alignSelf: "flex-end",
              fontSize: 12,
            }}
          >
            Currency : UGX
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.gray,
              alignSelf: "flex-end",
            }}
          >
            {formatDate(data.dateCreated)}
          </Text>
        </View>
      </View>
      {!expanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text>Items</Text>
              <Text>{(lineItems && lineItems.length) || 0}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Amount</Text>
              <Text>{totalCost}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Recieved</Text>
              <Text>{amountPaid}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>Balance</Text>
              <Text>{balanceGivenOut}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              Served by:{" "}
              <Text
                style={{
                  fontWeight: 400,
                }}
              >
                {data.createdByFullName}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={toggleExpand}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.dark,
                borderRadius: 3,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                More
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {expanded && (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 25,
              paddingEnd: 10,
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.3,
              marginTop: 10,
            }}
          >
            <Text style={{ flex: 2.5, fontWeight: 600 }}>Item</Text>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>
              Price
            </Text>
            <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
              Qnty
            </Text>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>
              Amount
            </Text>
          </View>
          <FlatList
            data={lineItems}
            renderItem={({ item }) => (
              <SaleItem data={item} itemCount={itemCount} total={totalCost} />
            )}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingEnd: 5,
              marginTop: 5,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: 600 }}>Total</Text>

            <Text style={{ textAlign: "center", fontWeight: 600 }}>
              {formatNumberWithCommas(totalCost)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Recieved </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(amountPaid)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Purchased{" "}
              <Text style={{ fontWeight: "400" }}>
                {itemCount >= 1 && (
                  <Text>
                    {itemCount}
                    {itemCount > 1 ? <Text> items</Text> : <Text> item</Text>}
                  </Text>
                )}
              </Text>
            </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(totalCost)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Balance</Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(balanceGivenOut)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 300,
                fontSize: 12,
              }}
            >
              Served by:{" "}
              <Text
                style={{
                  fontWeight: 400,
                }}
              >
                {data.createdByFullName}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={toggleExpand}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.dark,
                borderRadius: 3,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                Hide
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
const SaleItem = ({ data }) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: Colors.gray,
          borderBottomWidth: 0.3,
          alignItems: "center",
          height: "fit-content",
          paddingVertical: 8,
        }}
      >
        <Text style={{ flex: 2.5, justifyContent: "center" }}>
          {data.shopProductName}
        </Text>
        <Text style={{ flex: 1, textAlign: "center" }}>
          {formatNumberWithCommas(data.unitCost)}
        </Text>
        <Text style={{ flex: 0.5, textAlign: "center" }}>{data.quantity}</Text>
        <Text style={{ flex: 1, textAlign: "center" }}>
          {formatNumberWithCommas(data.totalCost)}
        </Text>
      </View>
    </>
  );
};
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
