import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Colors from "../../constants/Colors";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import ClientDebtsCard from "./components/ClientDebtsCard";
import Snackbar from "../../components/Snackbar";
import ItemHeader from "../sales/components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";
import { formatNumberWithCommas } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import { CLIENT_SALES_ENDPOINT } from "@utils/EndPointUtils";

const ClientDebts = ({ route }) => {
  const { client, currency } = route?.params ?? {};

  const [sales, setSales] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);

  const snackbarRef = useRef(null);

  const getClientSales = async () => {
    setLoading(true);
    setError(null);
    const params = { limit: 1000, clientId: client?.id, offset: 0 };

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
  };

  useEffect(() => {
    getClientSales();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader title={`Debts for ${client?.fullName}`} />

      <View style={{ paddingBottom: 10 }}>
        <View style={styles.debtHeader}>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 16,
            }}
          >
            Debt summary
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <ItemHeader value={sales?.length} title="Qty" />

          <VerticalSeparator />

          <ItemHeader title="Debt" value={formatNumberWithCommas(debt, currency)} />

          <VerticalSeparator />

          <ItemHeader title="Paid " value={formatNumberWithCommas(paid, currency)} />

          <VerticalSeparator />

          <ItemHeader title="Balance" value={formatNumberWithCommas(debt - paid, currency)} />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        {error && <Text style={{ textAlign: "center" }}>{error}</Text>}

        <FlatList
          style={{ marginTop: 10 }}
          data={sales}
          renderItem={({ item, index }) => {
            return <ClientDebtsCard debt={item} snackbarRef={snackbarRef} currency={currency} />;
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
