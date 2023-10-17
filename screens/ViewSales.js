import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BaseApiService } from "../utils/BaseApiService";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import MultiColumnView from "../components/MultiColumnView";
import HeaderOneButton from "../components/HeaderOneButton";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import SaleSummaryDialog from "../components/SaleSummaryDialog";
import { UserSessionUtils } from "../utils/UserSessionUtils";

const screenWidth = Dimensions.get("window").width;

export default function ViewSales({ navigation }) {
  const [sales, setSales] = useState([]); // sales got from the server
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [sale, setSale] = useState(null); //individual sale
  const [lineItems, setLineItems] = useState([]);
  const [offset, setOffset] = useState(0);

  let dummy = {
    status: "Success",
    message: "Data retrieved successfully",
    createdById: 1,
    createdByUsername: "john_doe",
    createdByFullName: "John Doe",
    changedById: 2,
    changedByUserName: "jane_smith",
    changedByFullName: "Jane Smith",
    dateCreated: "2023-10-04T17:15:52.858Z",
    dateChanged: "2023-10-04T17:15:52.858Z",
    recordStatus: "Active",
    serialNumber: "ABC123",
    id: 12345,
    totalCost: 100.5,
    amountPaid: 75.0,
    balanceGivenOut: 25.5,
    shopAttendantId: 3,
    shopAttendantName: "Alice Johnson",
    shopId: 987,
    shopName: "BestMart",
    statusId: 4,
    statusName: "Completed",
    lineItems: [
      {
        id: 5,
        shopProductId: 105,
        shopProductName: "Potatoes - 5 lbs",
        quantity: 2,
        unitCost: 200,
        totalCost: 400,
      },
      {
        id: 6,
        shopProductId: 106,
        shopProductName: "Orange Juice - 64 oz",
        quantity: 1,
        unitCost: 350,
        totalCost: 350,
      },
      {
        id: 7,
        shopProductId: 107,
        shopProductName: "Granola Cereal - 16 oz",
        quantity: 2,
        unitCost: 180,
        totalCost: 360,
      },
      {
        id: 8,
        shopProductId: 108,
        shopProductName: "Chicken Thighs - 4-Pack",
        quantity: 2,
        unitCost: 450,
        totalCost: 900,
      },
      {
        id: 9,
        shopProductId: 109,
        shopProductName: "Toilet Paper - 12 Rolls",
        quantity: 1,
        unitCost: 550,
        totalCost: 550,
      },
    ],
  };
  let shopId = null;
  const getSales = async () => {
    shopId = await UserSessionUtils.getShopId();
    let searchParameters = {
      searchTerm: "",
      offset: offset,
      limit: 0,
      shopId: shopId,
    };
    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setSales((prev) => [...prev, ...response.records]);
        setOffset(offset + 1);
        setTotalSales(response.totalItems);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((error) => {
        Alert.alert("Cannot get sales!", error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSales();
  }, []);

  const showSummary = (item) => {
    if (item.lineItems !== undefined) {
      setSale(item);
      for (let item of item.lineItems) {
        lineItems.push([
          item.shopProductName,
          item.unitCost,
          item.quantity,
          item.totalCost,
        ]);
      }
      setVisible(true);
    } else {
      setSale(dummy);
      for (let item of dummy.lineItems) {
        lineItems.push([
          item.shopProductName,
          item.unitCost,
          item.quantity,
          item.totalCost,
        ]);
      }
      setVisible(true);
    }
  };

  const closeSummary = () => {
    setVisible(false);
    setLineItems([]);
    setSale(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderOneButton
        bgColor={Colors.dark}
        title="Shop Sales"
        titleStyle={{ color: Colors.primary }}
        navPress={() => navigation.goBack()}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: Colors.light_2,
          paddingBottom: 30,
        }}
      >
        <OrientationLoadingOverlay
          visible={loading}
          color={Colors.primary}
          indicatorSize="large"
          messageFontSize={24}
          message=""
        />
        <AppStatusBar bgColor="black" content="light-content" />

        <View>
          <FlatList
            containerStyle={{ padding: 5 }}
            showsHorizontalScrollIndicator={false}
            data={sales}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TransactionItem
                data={item}
                index={sales.indexOf(item) + 1}
                showSummary={() => showSummary(item)}
              />
            )}
          />
        </View>
      </View>
      <SaleSummaryDialog
        visible={visible}
        closeSummary={closeSummary}
        sale={sale}
        lineItems={lineItems}
      />
    </SafeAreaView>
  );
}

function TransactionItem({ data, index, showSummary }) {
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
  return (
    <TouchableOpacity onPress={showSummary}>
      <View
        style={{
          width: screenWidth - 30,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: 10,
          marginHorizontal: 10,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          borderRadius: 5,
          elevation: 3,
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.primary,
          }}
        >
          <Text style={{ color: "black" }}>#{index}</Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: Colors.dark,
              marginBottom: 2,
            }}
          >
            Amount Recieved:
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: Colors.dark,
              marginBottom: 2,
            }}
          >
            Created by:
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: Colors.dark,
              marginBottom: 2,
            }}
          >
            Transaction Id:
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.gray,
              marginTop: 4,
              marginBottom: 2,
            }}
          >
            {formatDate(data.dateCreated)}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: Colors.lime,
              marginBottom: 2,
            }}
          >
            UGX {data.amountPaid}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>
            {data.createdByFullName}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>
            {data.id}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.light,
              marginTop: 4,
              marginBottom: 2,
              opacity: 0,
            }}
          >
            some space
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
