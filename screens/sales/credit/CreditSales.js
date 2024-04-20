import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import AppStatusBar from "../../../components/AppStatusBar";
import TopHeader from "../../../components/TopHeader";
import { BaseApiService } from "../../../utils/BaseApiService";
import CreditSaleListItem from "../components/CreditSaleListItem";
import Snackbar from "../../../components/Snackbar";
import { MAXIMUM_RECORDS_PER_FETCH } from "../../../constants/Constants";
import Colors from "../../../constants/Colors";
import { ActivityIndicator } from "react-native";
import { UserContext } from "../../../context/UserContext";
import ItemHeader from "../components/ItemHeader";
import { formatNumberWithCommas } from "../../../utils/Utils";
import VerticalSeparator from "../../../components/VerticalSeparator";

const CreditSales = () => {
  const [creditSales, setCreditSales] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [message, setMessage] = useState(null);

  const [debtors, setDebtors] = useState(0);
  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);

  const snackbarRef = useRef(null);

  const { reload, selectedShop } = useContext(UserContext);

  const fetchCreditSales = async () => {
    let searchParameters = {
      limit: 0,
      shopId: selectedShop?.id,
      offset: offset,
    };

    setShowFooter(true);

    setIsFetchingMore(true);

    new BaseApiService("/credit-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setTotalRecords(unPaid);
        //console.log(response.records);

        const unPaid = response.records?.filter(
          (item) => item.amountLoaned > item.amountRepaid
        );

        const debts = unPaid.reduce((a, b) => a + b?.amountLoaned, 0);

        const payments = unPaid.reduce((a, b) => a + b?.amountRepaid, 0);

        setDebtors(unPaid.length);
        setDebt(debts);

        setPaid(payments);

        setBal(debts - payments);
        setCreditSales((prevEntries) => [...prevEntries, ...unPaid]);

        if (response?.totalItems === 0) {
          setMessage("No debts found");
          setShowFooter(false);
        }

        setIsFetchingMore(false);
        setShowFooter(false);
      })
      .catch((error) => {
        setShowFooter(false);
        setMessage("Error fetching credit records");
      });
  };

  useEffect(() => {
    fetchCreditSales();
    if (reload === true) {
      snackbarRef.current.show("Payment saved succesfully");
    }
  }, [offset, reload]);

  const renderFooter = () => {
    if (showFooter === true) {
      if (creditSales.length === totalRecords && creditSales.length > 0) {
        return null;
      }

      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating size="large" color={Colors.dark} />
        </View>
      );
    }
  };

  const handleEndReached = () => {
    if (!isFetchingMore && creditSales.length < totalRecords) {
      setOffset(offset + MAXIMUM_RECORDS_PER_FETCH);
    }
    if (creditSales.length === totalRecords && creditSales.length > 10) {
      snackbarRef.current.show("No more additional data", 2500);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader title="Credited Records" showMenuDots />
      <View style={{}}>
        <View style={styles.debtHeader}>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 16,
            }}
          >
            Debt summary
          </Text>

          {/* <Text
            style={{
              color: Colors.primary,
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            Period {formatDate(new Date(), true)}
          </Text> */}
        </View>

        <View style={styles.summaryContainer}>
          <ItemHeader value={debtors} title="Debtors" ugx={false} />

          <VerticalSeparator />

          <ItemHeader title="Debt" value={formatNumberWithCommas(debt)} />

          <VerticalSeparator />

          <ItemHeader title="Paid " value={formatNumberWithCommas(paid)} />

          <VerticalSeparator />

          <ItemHeader title="Balance" value={formatNumberWithCommas(bal)} />
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: Colors.light }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={creditSales}
          renderItem={({ item }) => <CreditSaleListItem sale={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={styles.errorMsg}>
              <Text>{message}</Text>
            </View>
          )}
          // onEndReached={handleEndReached}
          onEndReachedThreshold={0}
          ListFooterComponent={renderFooter}
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
