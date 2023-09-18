import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BaseApiService } from "../utils/BaseApiService";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";

export default function ViewSales() {
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const getSales = async () => {
    let searchParameters = { searchTerm: "", offset: 0, limit: 0 };

    new BaseApiService("/shop-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        console.log(response);
        setSales(response.records);
        setTotalSales(response.totalItems);
      })
      .catch((error) => {
        Alert.alert("Cannot get sales!", error?.message);
      });
  };
  useEffect(() => {
    getSales();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.light_2,
          paddingHorizontal: 15,
          paddingBottom: 30,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <AppStatusBar />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
