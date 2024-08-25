import { View, Text, FlatList, SafeAreaView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import OfflineSaleTxnCard, {
  TxnCashSummary,
} from "./components/OfflineSaleTxnCard";
import ModalContent from "@components/ModalContent";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import PrimaryButton from "@components/buttons/PrimaryButton";
import VerticalSeparator from "@components/VerticalSeparator";
import { formatNumberWithCommas } from "@utils/Utils";
import ItemHeader from "./components/ItemHeader";
import { resolveUnsavedSales } from "@controllers/OfflineControllers";
import Snackbar from "@components/Snackbar";
import { useNetInfo } from "@react-native-community/netinfo";

const OfflineSales = () => {
  const [sales, setSales] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingErrors, setSavingErrors] = useState([]);
  const [qty, setQty] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [debts, setDebts] = useState(0);

  const snackbarRef = useRef(null);
  const netinfo = useNetInfo();

  const getOfflineSales = async () => {
    setVisible(false);
    setLoading(true);

    const salesList = await UserSessionUtils.getPendingSales();
    let totalQty = 0;
    let totalAmt = 0;
    let debtTxn = 0;

    salesList?.forEach((sale) => {
      const { lineItems, amountPaid, onCredit } = sale;
      const saleQty = lineItems?.reduce((a, b) => a + b.quantity, 0);
      const saleAmt = lineItems?.reduce((a, b) => a + b.totalCost, 0);

      totalAmt += saleAmt;
      totalQty += saleQty;
      if (onCredit === true) {
        debtTxn += 1;
      }
    });

    setSales(salesList);
    setQty(totalQty);
    setTotalValue(totalAmt);
    setDebts(debtTxn);

    setLoading(false);
  };

  const handleSave = async () => {
    if (netinfo.isInternetReachable === true && !loading) {
      setSavingErrors([]);
      setLoading(true);
      const errors = await resolveUnsavedSales();
      setSavingErrors(errors);

      await getOfflineSales();
      return;
    }

    if (netinfo.isInternetReachable === false) {
      snackbarRef.current.show("Cannot connect to the internet.", 5000);
      return;
    }
  };

  const handleRemove = (item, index) => {
    setSelectedSale(item);
    setVisible(true);
  };
  useEffect(() => {
    getOfflineSales();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader title="Offline Sales" showShopName={false} />

      {sales?.length > 0 && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 12,
              backgroundColor: "#000",
              paddingVertical: 10,
            }}
          >
            <ItemHeader value={formatNumberWithCommas(qty)} title="Qty" />

            <VerticalSeparator />

            <ItemHeader title="Sales" value={totalValue} isCurrency />

            <VerticalSeparator />

            <ItemHeader title="Cash " value={sales.length - debts} />

            <VerticalSeparator />

            <ItemHeader title="Debts" value={debts} />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <PrimaryButton
              title={"Save Sales"}
              darkMode={false}
              onPress={handleSave}
            />
          </View>

          <View
            style={{
              marginTop: 10,
              paddingHorizontal: 10,
              gap: 5,
            }}
          >
            {savingErrors?.map((e, i) => (
              <Text key={i} style={{ color: Colors.error }}>
                {e}
              </Text>
            ))}
          </View>
        </>
      )}

      <FlatList
        containerStyle={{ padding: 5 }}
        showsHorizontalScrollIndicator={false}
        data={sales}
        renderItem={({ item, index }) => (
          <OfflineSaleTxnCard
            key={index}
            data={item}
            onRemove={() => handleRemove(item, index)}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>
            {!loading ? "No sales found" : ""}
          </Text>
        )}
        onRefresh={() => getOfflineSales()}
        refreshing={loading}
      />

      <Snackbar ref={snackbarRef} />

      <RemoveSaleModal
        visible={visible}
        data={selectedSale}
        onComplete={getOfflineSales}
        hide={() => setVisible(false)}
      />
    </SafeAreaView>
  );
};

const RemoveSaleModal = ({
  visible = false,
  data,
  index,
  onComplete,
  ...props
}) => {
  const removeSale = async () => {
    await UserSessionUtils.removePendingSale(index);
    onComplete();
  };
  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            marginTop: 10,
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 12,
            marginStart: 1,
          }}
        >
          Confirm, remove sale record
        </Text>
      </View>

      <SalesTable sales={data?.lineItems} fixHeight={false} />

      <TxnCashSummary data={data} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 10,
          marginBottom: 5,
        }}
      >
        <PrimaryButton
          darkMode={false}
          title={"Cancel"}
          onPress={props?.hide}
        />
        <PrimaryButton title={"Remove"} onPress={removeSale} />
      </View>
    </ModalContent>
  );
};

export default OfflineSales;
