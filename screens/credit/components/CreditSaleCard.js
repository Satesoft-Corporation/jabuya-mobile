import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CardHeader from "@components/card_components/CardHeader";
import DataColumn from "@components/card_components/DataColumn";
import { CLIENT_DEBTS } from "@navigation/ScreenNames";
import CardFooter from "@components/card_components/CardFooter";
import { getClientSales } from "reducers/selectors";
import { useSelector } from "react-redux";

const CreditSaleCard = ({ client }) => {
  const navigation = useNavigation();

  const [sales, setSales] = useState([]);
  const [debt, setDebt] = useState(0);
  const [paid, setPaid] = useState(0);
  const [bal, setBal] = useState(0);

  const [show, setShow] = useState(false);

  const name = client?.fullName;
  const mob = client?.phoneNumber;
  const currency = client?.shop?.currency?.symbol;

  const creditSales = useSelector(getClientSales);

  const fetchCreditSales = async () => {
    const list = [...creditSales].filter((i) => i?.client_id === client?.id);

    const debt = list.reduce((a, b) => a + b?.amountLoaned, 0);
    const paid = list.reduce((a, b) => a + b?.amountRepaid, 0);
    const bal = debt - paid;

    setSales(list);
    setDebt(debt);
    setPaid(paid);
    setBal(bal);
    setShow(true);
  };

  useEffect(() => {
    fetchCreditSales();
  }, []);

  if (show === true) {
    return (
      <View style={styles.container}>
        <CardHeader value1={`CSN: ${client?.serialNumber}`} shop={client?.shop?.name} date={client?.dateCreated} />

        <View style={styles.content}>
          <DataColumn title={"Client"} value={name} left flex={2} value2={`${mob}`} />

          <DataColumn title={"Debt"} value={debt} currency={currency} />
          <DataColumn title={"Paid"} value={paid} currency={currency} />
          <DataColumn title={"Balance"} value={bal} currency={currency} />
        </View>

        <CardFooter
          btnTitle1={bal > 0 ? "View" : null}
          onClick1={() =>
            navigation.navigate(CLIENT_DEBTS, {
              client,
              sales,
              debt,
              paid,
              bal,
              currency,
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
