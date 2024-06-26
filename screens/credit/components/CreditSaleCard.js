import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BaseApiService } from "@utils/BaseApiService";
import CardHeader from "@components/card_components/CardHeader";
import DataColumn from "@components/card_components/DataColumn";
import CardFooter2 from "@components/card_components/CardFooter2";
import { CLIENT_DEBTS } from "@navigation/ScreenNames";

const CreditSaleCard = ({
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
  const currency = client?.shop?.currency?.symbol;

  const fetchCreditSales = async () => {
    let searchParameters = {
      limit: 0,
      offset: 0,
      clientId: client?.id,
    };

    await new BaseApiService("/credit-sales")
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
          shop={client?.shop?.name}
          date={client?.dateCreated}
        />

        <View style={styles.content}>
          <DataColumn
            title={"Client"}
            value={name}
            left
            flex={2}
            value2={`${mob}`}
          />

          <DataColumn title={"Debt"} value={debt} currency={currency} />
          <DataColumn title={"Paid"} value={paid} currency={currency} />
          <DataColumn title={"Balance"} value={bal} currency={currency} />
        </View>

        <CardFooter2
          renderBtn={bal > 0}
          btnTitle="More"
          onBtnPress={() =>
            navigation.navigate(CLIENT_DEBTS, {
              client,
              sales,
              debt,
              paid,
              bal,
            })
          }
        />
      </View>
    );
  }
};

export default CreditSaleCard;

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
