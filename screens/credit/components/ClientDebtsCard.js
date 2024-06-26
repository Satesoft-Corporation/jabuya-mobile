import { View, StyleSheet, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "@components/Icon";
import Colors from "@constants/Colors";
import CardHeader from "@components/card_components/CardHeader";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import DataRow from "@components/card_components/DataRow";
import CardFooter2 from "@components/card_components/CardFooter2";
import CardFooter1 from "@components/card_components/CardFooter1";

const ClientDebtsCard = ({ debt, snackbarRef }) => {
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(false);
  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const isFullyPaid = Math.abs(debt?.amountLoaned - debt?.amountRepaid) <= 0;
  const currency = debt?.sale?.shop?.currency?.symbol;

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
          <View style={{ flex: 1, marginTop: 10 }}>
            <DataRow
              key={1}
              label={"Total Debt"}
              value={debt?.amountLoaned}
              currency={currency}
            />

            <DataRow
              key={2}
              label={"Paid"}
              value={debt?.amountRepaid}
              currency={currency}
            />

            <DataRow
              key={4}
              label={"Balance"}
              value={debt?.amountLoaned - debt?.amountRepaid}
              currency={currency}
            />

            <DataRow
              key={5}
              label={"Served by"}
              value={debt?.createdByFullName}
            />

            <CardFooter1
              btnTitle2="Hide"
              btnTitle1="Pay"
              onClick1={() => {
                if (!isFullyPaid) {
                  navigation?.navigate(CREDIT_PAYMENTS, debt);
                } else {
                  snackbarRef?.current?.show("Sale is fully paid");
                }
              }}
              onClick2={toggleExpand}
              style={{ marginTop: 15 }}
            />
          </View>
        )}

        {!expanded && (
          <CardFooter2
            btnTitle="More"
            onBtnPress={toggleExpand}
            renderLeft={renderLeft}
          />
        )}
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
