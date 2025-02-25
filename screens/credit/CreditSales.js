import { View, Text, SafeAreaView, FlatList, StyleSheet, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import ItemHeader from "@screens/sales/components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import Colors from "@constants/Colors";
import Snackbar from "@components/Snackbar";
import CreditSaleCard from "./components/CreditSaleCard";
import { getOfflineParams, getSelectedShop } from "duqactStore/selectors";
import { useSelector } from "react-redux";
import { hasInternetConnection } from "@utils/NetWork";
import { formatNumberWithCommas } from "@utils/Utils";
import { getCanViewDebts } from "duqactStore/selectors/permissionSelectors";
import NoAuth from "@screens/Unauthorised";
import { CLIENT_FORM } from "@navigation/ScreenNames";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { saveShopClients } from "@controllers/OfflineControllers";

const CreditSales = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [clients, setClients] = useState([]);

  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedShop = useSelector(getSelectedShop);
  const viewDebts = useSelector(getCanViewDebts);
  const offlineParams = useSelector(getOfflineParams);

  const snackbarRef = useRef(null);

  const fetchClients = async () => {
    setMessage(null);
    setLoading(true);
    const shopClients = await UserSessionUtils.getShopDebtors(selectedShop?.id);

    const list = shopClients?.filter((item) => {
      const name = item?.fullName?.toLowerCase();
      const match = name?.includes(searchTerm.toLowerCase().trim());

      if (match) {
        return item;
      }
    });

    setClients(list);
    if (list.length === 0) {
      setMessage("No records found");
      setLoading(false);
      return true;
    }
    const debt = list.reduce((a, b) => a + b?.debt || 0, 0);
    const paid = list.reduce((a, b) => a + b?.repaidAmount || 0, 0);
    setDebt(debt);
    setPaid(paid);
    setBal(debt - paid);
    setLoading(false);
  };

  const handleRefresh = async () => {
    try {
      const hasNet = await hasInternetConnection();

      if (hasNet === true) {
        setLoading(true);
        await saveShopClients(offlineParams);
        await fetchClients();
        snackbarRef.current.show("Data synced", 5000);
      } else {
        snackbarRef.current.show("Cannot connect to the internet");
      }
    } catch (e) {
      setLoading(false);
      snackbarRef.current.show("Unexpected error");
    }
  };

  useEffect(() => {
    fetchClients();
  }, [selectedShop, searchTerm]);

  if (!viewDebts) {
    return <NoAuth />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader
        title="Debt records"
        showShops
        menuItems={[
          { name: "Add debtor", onClick: () => navigation.navigate(CLIENT_FORM) },
          { name: "Sync", onClick: () => handleRefresh() },
        ]}
        showMenuDots
        showSearch
        searchTerm={searchTerm}
        setSearchTerm={(e) => setSearchTerm(e)}
        onSearch={() => fetchClients()}
      />
      <View style={{ paddingBottom: 10 }}>
        <View style={styles.debtHeader}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>Debt summary</Text>
        </View>

        <View style={styles.summaryContainer}>
          <ItemHeader value={clients?.length} title="Debtors" />

          <VerticalSeparator />

          <ItemHeader title="Debt" value={formatNumberWithCommas(debt, selectedShop?.currency)} />

          <VerticalSeparator />

          <ItemHeader title="Paid " value={formatNumberWithCommas(paid, selectedShop?.currency)} />

          <VerticalSeparator />

          <ItemHeader title="Balance" value={formatNumberWithCommas(bal, selectedShop?.currency)} />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={clients}
          renderItem={({ item }) => {
            return <CreditSaleCard client={item} />;
          }}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={() => handleRefresh()}
          ListEmptyComponent={() => (
            <View style={styles.errorMsg}>
              <Text>{message}</Text>
            </View>
          )}
        />
        <Snackbar ref={snackbarRef} />
      </View>
    </SafeAreaView>
  );
};

export default CreditSales;

const styles = StyleSheet.create({
  debtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  errorMsg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});
