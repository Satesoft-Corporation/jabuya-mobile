import { memo, useCallback, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { formatDate, formatNumberWithCommas } from "../../../utils/Utils";
import CardHeader from "../../../components/card_components/CardHeader";
import SalesTable from "../../sales_desk/components/SalesTable";
import DataRow from "../../../components/card_components/DataRow";
import CardFooter2 from "../../../components/card_components/CardFooter2";
import { UserContext } from "../../../context/UserContext";
import CardFooter1 from "../../../components/card_components/CardFooter1";

function OfflineSaleTxnCard({ data, onRemove }) {
  const { lineItems, soldOnDate, onCredit, shopId } = data;

  const [expanded, setExpanded] = useState(false);

  const { shops } = useContext(UserContext);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const shopName = shops?.find((s) => s?.id === shopId)?.name;
  return (
    <View style={[styles.container, { borderWidth: onCredit ? 1 : 0 }]}>
      <CardHeader
        value1={shopName}
        value2={`${formatDate(soldOnDate, true)}`}
      />

      <SalesTable sales={lineItems} fixHeight={false} />

      {expanded && <TxnCashSummary data={data} />}

      {!expanded && <CardFooter2 onBtnPress={toggleExpand} btnTitle="More" />}

      {expanded && (
        <CardFooter1
          btnTitle1="Remove"
          btnTitle2="Hide"
          onClick2={toggleExpand}
          onClick1={onRemove}
        />
      )}
    </View>
  );
}

export default memo(OfflineSaleTxnCard);

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
