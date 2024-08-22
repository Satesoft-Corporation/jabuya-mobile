import CardFooter from "@components/card_components/CardFooter";
import CardHeader from "@components/card_components/CardHeader";
import DataRow from "@components/card_components/DataRow";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import { UserContext } from "context/UserContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

function OfflineSaleTxnCard({ data, onRemove }) {
  const { lineItems, soldOnDate, onCredit, shopId } = data;

  const [expanded, setExpanded] = useState(false);

  const { shops } = useContext(UserContext);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const shopName = shops?.find((shop) => shop?.id === shopId)?.name;
  return (
    <View style={[styles.container, { borderWidth: onCredit ? 1 : 0 }]}>
      <CardHeader
        value1={shopName}
        value2={`${formatDate(soldOnDate, true)}`}
      />

      <SalesTable sales={lineItems} fixHeight={false} />

      {expanded && <TxnCashSummary data={data} />}

      <CardFooter
        onClick2={toggleExpand}
        btnTitle2={!expanded ? "More" : "Hide"}
        btnTitle1={expanded ? "Remove" : null}
        onClick1={onRemove}
      />
    </View>
  );
}

export default OfflineSaleTxnCard;

export const TxnCashSummary = ({ data }) => {
  const { lineItems, amountPaid } = data;

  const [itemCount, setItemCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (lineItems !== undefined) {
      let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
      let cartCost = lineItems.reduce((a, i) => a + i.totalCost, 0);

      setItemCount(cartQty);
      setTotalCost(cartCost);
    }
  }, [data]);

  return (
    <View>
      <DataRow
        key={1}
        label={"Total"}
        value={formatNumberWithCommas(totalCost)}
        labelTextStyle={styles.label}
        style={{ marginTop: 5, marginBottom: 10 }}
        showCurrency
      />

      <DataRow
        key={2}
        label={"Recieved"}
        value={formatNumberWithCommas(amountPaid)}
        labelTextStyle={styles.label}
        showCurrency
      />
      <DataRow
        key={3}
        label={`Purchased ${
          itemCount > 1 ? `${itemCount} items` : `${itemCount} item`
        }`}
        value={formatNumberWithCommas(totalCost)}
        labelTextStyle={styles.label}
        showCurrency
      />

      <DataRow
        key={4}
        label={"Balance"}
        value={amountPaid - totalCost}
        labelTextStyle={styles.label}
        showCurrency
      />
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  value: { fontWeight: "600", fontSize: 14 },
  footerText1: {
    fontWeight: "600",
    fontSize: 12,
  },
  footerText2: {
    fontWeight: "300",
    fontSize: 12,
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
});
