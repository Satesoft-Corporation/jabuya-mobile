import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import React, { useRef } from "react";
import Colors from "../../constants/Colors";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import ClientDebtsCard from "./components/ClientDebtsCard";
import Snackbar from "../../components/Snackbar";
import ItemHeader from "../sales/components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";

const ClientDebts = ({ route }) => {
  const { client, sales, debt, paid, bal, currency } = route?.params ?? {};

  const snackbarRef = useRef(null);

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

          <ItemHeader title="Debt" value={debt} isCurrency />

          <VerticalSeparator />

          <ItemHeader title="Paid " value={paid} isCurrency />

          <VerticalSeparator />

          <ItemHeader title="Balance" value={bal} isCurrency />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={sales}
          renderItem={({ item, index }) => {
            return (
              <ClientDebtsCard
                debt={item}
                snackbarRef={snackbarRef}
                currency={currency}
              />
            );
          }}
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
