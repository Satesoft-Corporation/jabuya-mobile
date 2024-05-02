import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import CardHeader from "../../../components/cardComponents/CardHeader";
import { formatDate, formatNumberWithCommas } from "../../../utils/Utils";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";
import { useNavigation } from "@react-navigation/native";

const CreditSaleListItem = ({ sale }) => {
  const navigation = useNavigation();

  const balance = sale?.amountLoaned - sale?.amountRepaid;
  return (
    <View style={styles.container}>
      <CardHeader
        value1={`CSN: ${sale?.serialNumber}`}
        value2={formatDate(sale?.dateCreated)}
      />
      <View style={styles.content}>
        <View style={{ alignItems: "left" }}>
          <Text style={styles.clientTitle}>Client</Text>
          <Text style={{ fontWeight: 500 }}>{sale?.shopClient?.fullName}</Text>
          <Text style={{ fontWeight: 400, fontSize: 12 }}>
            Mob: {sale?.shopClient?.phoneNumber}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.label}>Credit</Text>
          <Text>{formatNumberWithCommas(sale?.amountLoaned)}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.label}>Paid</Text>
          <Text>{formatNumberWithCommas(sale?.amountRepaid)}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.label}>Balance</Text>
          <Text>{formatNumberWithCommas(balance)}</Text>
        </View>
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
  clientTitle: {
    fontWeight: "600",
    marginBottom: 3,
  },
  label: {
    fontWeight: "600",
    marginBottom: 10,
  },
});
