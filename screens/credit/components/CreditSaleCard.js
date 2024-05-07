import { View, StyleSheet } from "react-native";
import React, { memo } from "react";
import CardHeader from "../../../components/cardComponents/CardHeader";
import { formatDate } from "../../../utils/Utils";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";
import { useNavigation } from "@react-navigation/native";
import DataColumn from "../../../components/cardComponents/DataColumn";

const CreditSaleListItem = ({ sale }) => {
  const navigation = useNavigation();

  const balance = sale?.amountLoaned - sale?.amountRepaid;

  const name = sale?.shopClient?.fullName;
  const mob = sale?.shopClient?.phoneNumber;
  return (
    <View style={styles.container}>
      <CardHeader
        value1={`CSN: ${sale?.serialNumber}`}
        value2={formatDate(sale?.dateCreated)}
      />
      <View style={styles.content}>
        <DataColumn
          title={"Client"}
          value={name}
          left
          flex={2}
          value2={`Mob: ${mob}`}
        />

        <DataColumn title={"Debt"} value={sale?.amountLoaned} isCurrency />
        <DataColumn title={"Paid"} value={sale?.amountRepaid} isCurrency />
        <DataColumn title={"Balance"} value={balance} isCurrency end />
      </View>

      <CardFooter2
        renderBtn={balance > 0}
        label={`Served by: ${sale?.createdByFullName}`}
        btnTitle="Pay"
        onBtnPress={() => {
          navigation.navigate("credit_payments", sale);
        }}
      />
    </View>
  );
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
  },
  content: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
});
