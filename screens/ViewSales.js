import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BaseApiService } from "../utils/BaseApiService";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import MultiColumnView from "../components/MultiColumnView";
import HeaderOneButton from "../components/HeaderOneButton";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";

const screenWidth = Dimensions.get("window").width;

export default function ViewSales({ navigation }) {
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  const getSales = async () => {
    let searchParameters = {
      searchTerm: "",
      offset: 0,
      limit: 0,
    };

    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setSales(response.records);
        console.log(response.records);
        setTotalSales(response.totalItems);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        Alert.alert("Cannot get sales!", error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSales();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            paddingHorizontal: 15,
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
            <MultiColumnView
              containerStyle={{ padding: 5 }}
              data={sales}
              renderItem={(item, i) => (
                <TransactionItem data={item} index={sales.indexOf(item) + 1} />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionItem({ data, index }) {
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
  );
}
