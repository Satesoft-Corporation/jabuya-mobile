import { View, Text, FlatList, SafeAreaView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import Snackbar from "@components/Snackbar";
import { useNetInfo } from "@react-native-community/netinfo";
import { useDispatch, useSelector } from "react-redux";
import { getOffersDebt, getOfflineSales } from "reducers/selectors";
import { BaseApiService } from "@utils/BaseApiService";
import { removeOfflineSale } from "actions/shopActions";

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
  const salesList = useSelector(getOfflineSales);
  const offersDebt = useSelector(getOffersDebt);
  const dispatch = useDispatch();

  const getOfflineSale = async () => {
    setVisible(false);
    setLoading(true);

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

  const saveSales = async () => {
    if (salesList?.length > 0) {
      let errors = [];

      // Use map to create an array of promises
      await Promise.all(
        salesList.map(async (cart, index) => {
          console.log("Saving sale", index + 1);
          try {
            const response = await new BaseApiService(
              SHOP_SALES_ENDPOINT
            ).postRequest(cart);
            const info = await response.json();
            const status = response.status;

            if (status === 200) {
              try {
                const confirmResponse = await new BaseApiService(
                  `/shop-sales/${info?.id}/confirm`
                ).postRequest();

                await confirmResponse.json();

                dispatch(removeOfflineSale(index));
              } catch (error) {
                errors.push(error?.message);
              }
            } else {
              errors.push(info?.message);
            }
          } catch (error) {
            errors.push(error?.message);
          }
        })
      );

      return errors;
    }
  };
  const handleSave = async () => {
    if (netinfo.isInternetReachable === true && !loading) {
      setSavingErrors([]);
      setLoading(true);
      const errors = await saveSales();
      setSavingErrors(errors);

      await getOfflineSale();
      return;
    }

    if (netinfo.isInternetReachable === false) {
      snackbarRef.current.show("Cannot connect to the internet.", 5000);
      return;
    }
  };

  const handleRemove = (item, index) => {
    setSelectedSale({ ...item, index });
    setVisible(true);
  };
  useEffect(() => {
    getOfflineSale();
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

            <ItemHeader
              title="Sales"
              value={formatNumberWithCommas(totalValue)}
            />

            <VerticalSeparator />

            <ItemHeader title="Cash " value={sales.length - debts} />

            {offersDebt && (
              <>
                <VerticalSeparator />

                <ItemHeader title="Debts" value={debts} />
              </>
            )}
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
        data={salesList}
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
      />

      <Snackbar ref={snackbarRef} />

      <RemoveSaleModal
        visible={visible}
        data={selectedSale}
        hide={() => {
          setVisible(false);
          getOfflineSale();
        }}
      />
    </SafeAreaView>
  );
};

const RemoveSaleModal = ({ visible = false, data, ...props }) => {
  const dispatch = useDispatch();

  const removeSale = () => {
    dispatch(removeOfflineSale(data?.index));
    props?.hide();
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
