import { memo, useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  extractTime,
  formatDate,
  formatNumberWithCommas,
} from "../../../utils/Utils";
import CardHeader from "../../../components/cardComponents/CardHeader";
import SalesTable from "../../sales_desk/components/SalesTable";
import DataRow from "../../../components/cardComponents/DataRow";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";

function SaleTxnCard({ data }) {
  // sales report item card

  const { lineItems, totalCost, amountPaid, balanceGivenOut, shopName } = data;

  const [expanded, setExpanded] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [profit, setProfit] = useState(0);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const balText =
    balanceGivenOut < 0
      ? `(${formatNumberWithCommas(Math.abs(balanceGivenOut))})`
      : formatNumberWithCommas(Math.abs(balanceGivenOut));

  useEffect(() => {
    if (lineItems !== undefined) {
      let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
      let cartProfit = lineItems.reduce((a, i) => a + i.totalProfit, 0);

      setItemCount(cartQty);
      setProfit(Math.round(cartProfit));
    }
  }, [data]);

  const servedBy = () => (
    <Text style={styles.footerText1}>
      Served by:{" "}
      <Text style={styles.footerText2}>{data?.createdByFullName}</Text>
    </Text>
  );

  const renderCurrencyValue = (value) => (
    <>
      <Text style={{ fontSize: 8, fontWeight: 400 }}>UGX </Text>
      {formatNumberWithCommas(value)}
    </>
  );

  return (
    <View
      style={[styles.container, { borderWidth: balanceGivenOut < 0 ? 1 : 0 }]}
    >
      <CardHeader
        value1={shopName}
        value2={`${formatDate(data?.soldOnDate, true)}`}
      />
      <CardHeader
        value1={`SN: ${data?.serialNumber}`}
        value2={`${extractTime(data.dateCreated)}`}
        value1Style={{ fontWeight: 400 }}
      />

      {!expanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Items</Text>
              <Text>{itemCount}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Recieved</Text>
              <Text>{renderCurrencyValue(amountPaid)}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Amount</Text>
              <Text style={{ fontWeight: 600 }}>
                {renderCurrencyValue(totalCost)}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Balance</Text>
              <Text style={{ fontSize: 8, fontWeight: 400 }}>
                UGX <Text style={{ fontSize: 14 }}>{balText}</Text>
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Income</Text>
              <Text>{renderCurrencyValue(profit)}</Text>
            </View>
          </View>
          <CardFooter2
            onBtnPress={toggleExpand}
            btnTitle="More"
            label={servedBy()}
          />
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
            showCurrency
          />

          <DataRow
            key={2}
            label={"Recieved"}
            value={formatNumberWithCommas(amountPaid)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            showCurrency
          />
          <DataRow
            key={3}
            label={`Purchased ${
              itemCount > 1 ? `${itemCount} items` : `${itemCount} item`
            }`}
            value={formatNumberWithCommas(totalCost)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            showCurrency
          />

          <DataRow
            key={4}
            label={"Balance"}
            value={balText}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            showCurrency
          />
          <DataRow
            key={5}
            label={"Income"}
            value={formatNumberWithCommas(profit)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
            showCurrency
          />

          {balanceGivenOut < 0 && (
            <DataRow
              key={6}
              label={"Client's mobile"}
              value={data?.clientPhoneNumber}
              labelTextStyle={styles.label}
              valueTextStyle={styles.value}
            />
          )}

          <CardFooter2
            onBtnPress={toggleExpand}
            btnTitle="Hide"
            label={servedBy(false)}
            style={{ marginTop: 15 }}
          />
        </View>
      )}
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
