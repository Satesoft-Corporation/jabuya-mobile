import { View, StyleSheet } from "react-native";
import React, { memo, useEffect, useState } from "react";
import CardHeader from "../../../components/cardComponents/CardHeader";
import { formatDate } from "../../../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import DataColumn from "../../../components/cardComponents/DataColumn";
import { BaseApiService } from "../../../utils/BaseApiService";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";
import { CLIENT_DEBTS } from "../../../navigation/ScreenNames";

const CreditSaleListItem = ({
  client,
  appendDebtValue,
  appendBalValue,
  appendPaidValue,
}) => {
  const navigation = useNavigation();

  const [sales, setSales] = useState([]);
  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);

  const [show, setShow] = useState(false);

  const name = client?.fullName;
  const mob = client?.phoneNumber;

  const fetchCreditSales = async () => {
    let searchParameters = {
      limit: 0,
      offset: 0,
      clientId: client?.id,
    };

    new BaseApiService("/credit-sales")
      .getRequestWithJsonResponse(searchParameters)
      .then((response) => {
        setSales(response?.records);
        const debt = response.records.reduce((a, b) => a + b?.amountLoaned, 0);
        const paid = response.records.reduce((a, b) => a + b?.amountRepaid, 0);
        const bal = debt - paid;

        setDebt(debt);
        setPaid(paid);
        setBal(bal);
        appendDebtValue(debt);
        appendBalValue(bal);
        appendPaidValue(paid);
        setShow(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchCreditSales();
  }, []);

  if (show === true) {
    return (
      <View style={styles.container}>
        <CardHeader
          value1={`CSN: ${client?.serialNumber}`}
          value2={formatDate(client?.dateCreated)}
        />
        <View style={styles.content}>
          <DataColumn
            title={"Client"}
            value={name}
            left
            flex={2}
            value2={`${mob}`}
          />

          <DataColumn title={"Debt"} value={debt} isCurrency />
          <DataColumn title={"Paid"} value={paid} isCurrency />
          <DataColumn title={"Balance"} value={bal} isCurrency end />
        </View>

        <CardFooter2
          btnTitle="More"
          onBtnPress={() =>
            navigation.navigate(CLIENT_DEBTS, { client, sales })
          }
        />
      </View>
    );
  }
};

export default memo(CreditSaleListItem);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 1,
  },
  content: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
});
