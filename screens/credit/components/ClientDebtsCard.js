import { View, StyleSheet, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "@components/Icon";
import Colors from "@constants/Colors";
import CardHeader from "@components/card_components/CardHeader";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import DataRow from "@components/card_components/DataRow";
import { CREDIT_PAYMENTS } from "@navigation/ScreenNames";
import CardFooter from "@components/card_components/CardFooter";
import { formatNumberWithCommas } from "@utils/Utils";

const ClientDebtsCard = ({ debt, currency }) => {
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const isFullyPaid = Math.abs(debt?.amountLoaned - debt?.amountRepaid) <= 0;
  const showPay = expanded && isFullyPaid === false;

  const renderLeft = useCallback(() => {
    if (isFullyPaid) {
      return (
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Icon
            name="checkcircleo"
            groupName="AntDesign"
            color={Colors.green}
          />

          <Text style={{ color: Colors.green }}>Cleared</Text>
        </View>
      );
    }
  }, [isFullyPaid]);

  if (debt?.lineItems?.length > 0) {
    return (
      <View style={styles.container}>
        <CardHeader
          value1={`SN: ${debt?.serialNumber}`}
          date={debt?.dateCreated}
          shop={debt?.sale?.shop?.name}
        />

        <SalesTable
          sales={debt?.lineItems}
          fixHeight={false}
          currency={currency}
        />
        {expanded && (
          <View style={{ flex: 1, marginTop: 5 }}>
            <DataRow
              key={1}
              label={"Total Debt"}
              value={formatNumberWithCommas(debt?.amountLoaned)}
              currency={currency}
            />

            <DataRow
              key={2}
              label={"Paid"}
              value={formatNumberWithCommas(debt?.amountRepaid)}
              currency={currency}
            />

            <DataRow
              key={4}
              label={"Balance"}
              value={formatNumberWithCommas(
                debt?.amountLoaned - debt?.amountRepaid
              )}
              currency={currency}
            />
            <DataRow
              key={5}
              label={"Served by"}
              value={debt?.createdByFullName}
            />
          </View>
        )}

        <CardFooter
          renderLeft={renderLeft}
          btnTitle2={expanded ? "Hide" : "More"}
          btnTitle1={showPay ? "Pay" : null}
          onClick1={() => {
            navigation?.navigate(CREDIT_PAYMENTS, debt);
          }}
          onClick2={toggleExpand}
          darkMode={!expanded}
        />
      </View>
    );
  }
};

export default ClientDebtsCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 5,
    elevation: 1,
  },
  content: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
});
