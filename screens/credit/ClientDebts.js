import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "constants/Colors";
import AppStatusBar from "components/AppStatusBar";
import TopHeader from "components/TopHeader";
import ClientDebtsCard from "./components/ClientDebtsCard";
import Snackbar from "components/Snackbar";
import ItemHeader from "../sales/components/ItemHeader";
import VerticalSeparator from "components/VerticalSeparator";
import { formatNumberWithCommas } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import { CLIENT_SALES_ENDPOINT, SHOP_SALES_ENDPOINT } from "@utils/EndPointUtils";
import SaleTxnCard from "@screens/sales/components/SaleTxnCard";
import { getCanViewShopIncome } from "duqactStore/selectors/permissionSelectors";
import { useSelector } from "react-redux";

const ClientDebts = ({ route }) => {
  const { client, currency, cashSales } = route?.params ?? {};

  const [sales, setSales] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [salesValue, setSalesValue] = useState(0); //total money value sold
  const [daysProfit, setDaysProfit] = useState(0);
  const [daysCapital, setDaysCapital] = useState(0);

  const canViewIncome = useSelector(getCanViewShopIncome);

  const snackbarRef = useRef(null);
  const getClientSales = async () => {
    setLoading(true);
    setError(null);

    const params = { limit: 100, clientId: client?.id, offset: 0 };

    if (cashSales == true) {
      await new BaseApiService(SHOP_SALES_ENDPOINT)
        .getRequestWithJsonResponse({ ...params, paymentMode: "CASH" })
        .then((response) => {
          if (response.totalItems === 0) {
            setError(`No sale records found.`);
          }

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
    } else {
      await new BaseApiService(CLIENT_SALES_ENDPOINT)
        .getRequestWithJsonResponse(params)
        .then((r) => {
          setSales(r.records);
          const tPaid = r.records.reduce((a, b) => a + b?.amountRepaid, 0);
          const tDebt = r.records.reduce((a, b) => a + b?.amountLoaned, 0);

          setPaid(tPaid);
          setDebt(tDebt);
          setLoading(false);
          if (r?.totalItems === 0) {
            setError("No records found");
          }
        })
        .catch((e) => {
          setError(e?.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getClientSales();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader title={`${cashSales ? "Sales" : "Debts"} for ${client?.fullName}`} />

      <View style={{ paddingBottom: 10 }}>
        <View style={styles.debtHeader}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>{cashSales ? "Sale" : "Debt"} summary</Text>
        </View>

        <View style={styles.summaryContainer}>
          <ItemHeader value={sales?.length} title="Qty" />

          <VerticalSeparator />

          <ItemHeader title={cashSales ? "Sales" : "Debt"} value={formatNumberWithCommas(cashSales ? salesValue : debt, currency)} />

          <VerticalSeparator />

          <ItemHeader title={cashSales ? "Capital" : "Paid"} value={formatNumberWithCommas(cashSales ? daysCapital : paid, currency)} />

          <VerticalSeparator />

          <ItemHeader title={cashSales ? "Income" : "Balance"} value={formatNumberWithCommas(cashSales ? daysProfit : debt - paid, currency)} />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        {error && <Text style={{ textAlign: "center" }}>{error}</Text>}

        <FlatList
          style={{ marginTop: 10 }}
          data={sales}
          renderItem={({ item, index }) => {
            return cashSales ? (
              <SaleTxnCard key={index} data={item} onClient />
            ) : (
              <ClientDebtsCard debt={item} snackbarRef={snackbarRef} currency={currency} />
            );
          }}
          refreshing={loading}
          onRefresh={getClientSales}
          keyExtractor={(item) => item.id.toString()}
        />
        <Snackbar ref={snackbarRef} />
      </View>
    </SafeAreaView>
  );
};

export default ClientDebts;

const styles = StyleSheet.create({
  debtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  summaryContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});
