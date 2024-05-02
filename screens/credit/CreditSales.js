import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import {
  convertDateFormat,
  formatDate,
  formatNumberWithCommas,
} from "../../utils/Utils";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import ItemHeader from "../sales/components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";
import Snackbar from "../../components/Snackbar";
import Colors from "../../constants/Colors";
import { BaseApiService } from "../../utils/BaseApiService";
import CreditSaleCard from "./components/CreditSaleCard";
import { CLIENT_FORM } from "../../navigation/ScreenNames";

const CreditSales = () => {
  const navigation = useNavigation();
  const [creditSales, setCreditSales] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const [debtors, setDebtors] = useState(0);
  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const snackbarRef = useRef(null);

  const { shops, selectedShop, setSelectedShop, userParams } =
    useContext(UserContext);

  const onChange = (event, selectedDate) => {
    setVisible(false);
    fetchCreditSales(selectedDate);
    setDate(selectedDate);
    setFiltering(true);
  };

  const fetchCreditSales = async (day = null) => {
    let searchParameters = {
      limit: 0,
      ...(selectedShop?.id !== 0 && { shopId: selectedShop?.id }),
      offset: offset,
      ...(day && {
        startDate: convertDateFormat(day),
        endDate: convertDateFormat(day, true),
      }),
    };

    setCreditSales([]);
    setDebt(0);
    setPaid(0);
    setBal(0);
    setDebtors(0);
    setMessage(null);
    setLoading(true);

    if (day === null) {
      setFiltering(false);
      setDate(new Date());
    }
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
          setMessage(`No debts found on ${formatDate(date, true)} for`);
        }

        setLoading(false);
      })
      .catch((error) => {
        setMessage("Error fetching credit records for");
        setLoading(false);
        console.log(error);
      });
  };

  const handleRefresh = () => {
    setFiltering(false);
    setDate(new Date());
    fetchCreditSales();
  };
  useEffect(() => {
    fetchCreditSales();
  }, [selectedShop]);

  const menuItems = [
    ...(userParams?.isShopOwner === true
      ? [
          {
            name: "Add debtor",
            onClick: () => navigation.navigate(CLIENT_FORM),
          },
        ]
      : []),
    {
      name: "Select date",
      onClick: () => setVisible(true),
    },
    ...(shops?.length > 1
      ? shops?.map((shop) => {
          return {
            ...shop,
            onClick: () => setSelectedShop(shop),
            bold: shop?.id === selectedShop.id,
          };
        })
      : []),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <AppStatusBar />
      <TopHeader title="Debt records" showMenuDots menuItems={menuItems} />
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

          <Text
            style={{
              fontSize: 13,
              fontWeight: 600,
              alignSelf: "flex-end",
              color: Colors.primary,
            }}
          >
            {filtering ? formatDate(date, true) : "Overrall"}
          </Text>
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

      <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={creditSales}
          renderItem={({ item }) => <CreditSaleCard sale={item} />}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={() => handleRefresh()}
          ListEmptyComponent={() => (
            <View style={styles.errorMsg}>
              <Text>{message}</Text>
              {message && <Text>{selectedShop?.name}</Text>}
            </View>
          )}
        />
        <Snackbar ref={snackbarRef} />

        {visible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}
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
