import { View, Text, SafeAreaView, FlatList, StyleSheet, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import ItemHeader from "@screens/sales/components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import Colors from "@constants/Colors";
import Snackbar from "@components/Snackbar";
import CreditSaleCard from "./components/CreditSaleCard";
import { CLIENT_FORM } from "@navigation/ScreenNames";
import { saveClientSalesOnDevice } from "@controllers/OfflineControllers";
import { getClientSales, getOfflineParams, getSelectedShop, getShopClients, getUserType } from "reducers/selectors";
import { ALL_SHOPS_LABEL, userTypes } from "@constants/Constants";
import { useSelector } from "react-redux";
import { setClientSales } from "actions/shopActions";
import { hasInternetConnection } from "@utils/NetWork";
import { formatNumberWithCommas } from "@utils/Utils";

const CreditSales = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [clients, setClients] = useState([]);

  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);
  const [adds, setAdds] = useState(0);

  const offlineParams = useSelector(getOfflineParams);
  const selectedShop = useSelector(getSelectedShop);
  const userType = useSelector(getUserType);
  const creditSales = useSelector(getClientSales);
  const shopClients = useSelector(getShopClients);

  const isShopAttendant = userType === userTypes.isShopAttendant;
  const isShopOwner = userType === userTypes.isShopOwner;

  const snackbarRef = useRef(null);

  const fetchClients = async () => {
    setMessage(null);
    setLoading(true);
    setBal(0);
    setDebt(0);
    setPaid(0);
    setAdds(0);
    setClients(shopClients?.filter((i) => i?.shop?.id === selectedShop?.id));

    let filteredSales = [...creditSales];

    if (selectedShop?.name !== ALL_SHOPS_LABEL) {
      filteredSales = creditSales.filter((i) => i.shopId === selectedShop?.id);
    }

    if (creditSales.length === 0) {
      setMessage("No records found");
      setLoading(false);
      return true;
    }
    const debt = filteredSales.reduce((a, b) => a + b?.amountLoaned, 0);
    const paid = filteredSales.reduce((a, b) => a + b?.amountRepaid, 0);
    setDebt(debt);
    setPaid(paid);
    setBal(debt - paid);
    setLoading(false);
  };

  const handleRefresh = async () => {
    const hasNet = await hasInternetConnection();

    if (hasNet === true) {
      setLoading(true);
      const clientSales = await saveClientSalesOnDevice(offlineParams, creditSales);
      dispatch(setClientSales(clientSales));
      fetchClients();
    } else {
      Alert.alert("Cannot connect to the internet");
    }
  };
  useEffect(() => {
    fetchClients();
  }, [selectedShop]);

  const menuItems = [
    ...(isShopOwner === true
      ? [
          {
            name: "Add debtor",
            onClick: () => navigation.dispatch(StackActions.replace(CLIENT_FORM)),
          },
        ]
      : []),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader title="Debt records" showMenuDots={!isShopAttendant} menuItems={menuItems} showShops />
      <View style={{ paddingBottom: 10 }}>
        <View style={styles.debtHeader}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>Debt summary</Text>
        </View>

        <View style={styles.summaryContainer}>
          <ItemHeader value={clients?.length} title="Debtors" />

          <VerticalSeparator />

          <ItemHeader title="Debt" value={formatNumberWithCommas(debt)} />

          <VerticalSeparator />

          <ItemHeader title="Paid " value={formatNumberWithCommas(paid)} isCurrency />

          <VerticalSeparator />

          <ItemHeader title="Balance" value={formatNumberWithCommas(bal)} isCurrency />
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
