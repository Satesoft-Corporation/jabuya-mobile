import CardFooter from "@components/card_components/CardFooter";
import DataColumn from "@components/card_components/DataColumn";
import DataRow from "@components/card_components/DataRow";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import { formatNumberWithCommas } from "@utils/Utils";
import { memo, useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import SaleCardHeader from "./SaleCardHeader";

function SaleTxnCard({ data, print, shops = [] }) {
  // sales report item card

  const { lineItems, totalCost, amountPaid, balanceGivenOut } = data;

  const [expanded, setExpanded] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [profit, setProfit] = useState(0);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  useEffect(() => {
    if (lineItems !== undefined) {
      let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
      let cartProfit = lineItems.reduce((a, i) => a + i.totalProfit, 0);

      setItemCount(cartQty);
      setProfit(Math.round(cartProfit));
    }
  }, [data]);

  return (
    <View
      style={[
        styles.container,
        { borderWidth: balanceGivenOut < 0 ? 1 : 0, gap: 8 },
      ]}
    >
      <SaleCardHeader data={data} expanded={expanded} />

      {!expanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <DataColumn title={"Qty"} value={itemCount} />

            <DataColumn
              title={"Recieved"}
              value={amountPaid}
              currency={data?.currency}
            />

            <DataColumn
              title={"Amount"}
              value={totalCost}
              currency={data?.currency}
            />
            <DataColumn
              title={"Balance"}
              value={balanceGivenOut}
              currency={data?.currency}
            />
          </View>
        </>
      )}
      {expanded && (
        <View style={{ flex: 1, marginTop: 10 }}>
          <SalesTable sales={lineItems} fixHeight={false} />
          <DataRow
            key={1}
            label={"Total"}
            value={formatNumberWithCommas(totalCost)}
            labelTextStyle={styles.label}
            style={{ marginTop: 5, marginBottom: 10 }}
            valueTextStyle={styles.value}
            currency={data?.currency}
          />

          <DataRow
            key={2}
            label={"Recieved"}
            value={formatNumberWithCommas(amountPaid)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            currency={data?.currency}
          />
          <DataRow
            key={3}
            label={`Purchased ${
              itemCount > 1 ? `${itemCount} items` : `${itemCount} item`
            }`}
            value={formatNumberWithCommas(totalCost)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            currency={data?.currency}
          />

          <DataRow
            key={4}
            label={"Balance"}
            value={formatNumberWithCommas(balanceGivenOut)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            currency={data?.currency}
          />
          <DataRow
            key={5}
            label={"Income"}
            value={formatNumberWithCommas(profit)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            currency={data?.currency}
          />

          {data?.clientName && (
            <DataRow
              key={6}
              label={"Client's name"}
              value={data?.clientName}
              labelTextStyle={styles.label}
              valueTextStyle={styles.value}
            />
          )}

          {data?.clientPhoneNumber && (
            <DataRow
              key={7}
              label={"Client's mobile"}
              value={data?.clientPhoneNumber}
              labelTextStyle={styles.label}
              valueTextStyle={styles.value}
            />
          )}
        </View>
      )}

      <CardFooter
        onClick2={toggleExpand}
        btnTitle1={expanded ? "Print" : null}
        label={data?.createdByFullName}
        served
        darkMode={!expanded}
        btnTitle2={expanded ? "Hide" : "More"}
        onClick1={() => print(data)}
      />

      {shops?.length > 1 && <CardFooter label={data?.shopName} />}
    </View>
  );
}

export default memo(SaleTxnCard);
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
  },
});
