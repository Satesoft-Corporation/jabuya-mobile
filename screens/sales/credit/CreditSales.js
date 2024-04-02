import { View, Text, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AppStatusBar from "../../../components/AppStatusBar";
import TopHeader from "../../../components/TopHeader";
import { Icon } from "../../../components/Icon";
import { BaseApiService } from "../../../utils/BaseApiService";
import CreditSaleListItem from "../../../components/credit/CreditSaleListItem";

const CreditSales = () => {
  const [creditSales, setCreditSales] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchCreditSales = async () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
    };

    new BaseApiService("/credit-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setCreditSales(response.records);
        console.log(response.records);
        setTotalRecords(response.totalItems);
        setIsLoading(false);
      })
      .catch((error) => {
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error",
        //   detail: error?.message,
        //   life: 3000,
        // });
        // setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCreditSales();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader title="Credited Records" />
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={creditSales}
          renderItem={({ item }) => <CreditSaleListItem sale={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

export default CreditSales;
