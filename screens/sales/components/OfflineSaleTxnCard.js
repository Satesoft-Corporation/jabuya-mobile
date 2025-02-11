import CardFooter from "@components/card_components/CardFooter";
import CardHeader from "@components/card_components/CardHeader";
import DataRow from "@components/card_components/DataRow";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { getShops } from "duqactStore/selectors";

function OfflineSaleTxnCard({ data, onRemove }) {
  const { lineItems, soldOnDate, onCredit, shopId } = data;

  const [expanded, setExpanded] = useState(false);

  const shops = useSelector(getShops);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const shop = shops?.find((shop) => shop?.id === shopId);

  return (
    <View style={[styles.container, { borderWidth: onCredit ? 1 : 0 }]}>
      <CardHeader value1={shop?.name} value2={`${formatDate(soldOnDate, true)}`} />

      <SalesTable sales={lineItems} fixHeight={false} />

      {expanded && <TxnCashSummary data={data} shop={shop} />}

      <CardFooter onClick2={toggleExpand} btnTitle2={!expanded ? "More" : "Hide"} btnTitle1={expanded ? "Remove" : null} onClick1={onRemove} />
    </View>
  );
}

export default OfflineSaleTxnCard;

export const TxnCashSummary = ({ data, shop }) => {
  const { lineItems, amountPaid } = data;

  const [itemCount, setItemCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const currency = shop?.currency;
  useEffect(() => {
    if (lineItems) {
      let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
      let cartCost = lineItems.reduce((a, i) => a + i.totalCost, 0);

      setItemCount(cartQty);
      setTotalCost(cartCost);
    }
  }, [data]);

  return (
    <View>
      <DataRow key={1} label={"Total"} value={formatNumberWithCommas(totalCost, currency)} />

      <DataRow key={2} label={"Recieved"} value={formatNumberWithCommas(amountPaid, currency)} />
      <DataRow
        key={3}
        label={`Purchased ${itemCount > 1 ? `${itemCount} items` : `${itemCount} item`}`}
        value={formatNumberWithCommas(totalCost, currency)}
      />

      <DataRow key={4} label={"Balance"} value={formatNumberWithCommas(amountPaid - totalCost, currency)} />
    </View>
  );
};
const styles = StyleSheet.create({
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
