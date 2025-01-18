import { View, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import CardHeader from "@components/card_components/CardHeader";
import DataColumn from "@components/card_components/DataColumn";
import { CLIENT_DEBTS } from "@navigation/ScreenNames";
import CardFooter from "@components/card_components/CardFooter";
import { formatNumberWithCommas } from "@utils/Utils";

const CreditSaleCard = ({ client }) => {
  const navigation = useNavigation();

  const { fullName, debt, repaidAmount, balance, serialNumber } = client ?? {};
  const currency = client?.shop?.currency?.symbol;

  return (
    <View style={styles.container}>
      <CardHeader value1={`CSN: ${serialNumber}`} shop={client?.shop?.name} date={client?.dateCreated} />

      <View style={styles.content}>
        <DataColumn title={"Client"} value={fullName} left flex={2} />

        <DataColumn title={"Debt"} value={formatNumberWithCommas(debt, currency)} />
        <DataColumn title={"Paid"} value={formatNumberWithCommas(repaidAmount, currency)} />
        <DataColumn title={"Balance"} value={formatNumberWithCommas(balance, currency)} />
      </View>

      <CardFooter
        btnTitle2={balance > 0 ? "View" : null} //change this line
        onClick2={() => navigation.navigate(CLIENT_DEBTS, { client, currency })}
      />
    </View>
  );
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
