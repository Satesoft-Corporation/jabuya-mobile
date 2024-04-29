import { memo, useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  extractTime,
  formatDate,
  formatNumberWithCommas,
} from "../../../utils/Utils";
import CardHeader from "../../../components/cardComponents/CardHeader";
import SalesTable from "../../sales-desk/components/SalesTable";
import DataRow from "../../../components/cardComponents/DataRow";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";

function SaleTransactionItem({ data, isShopOwner }) {
  // sales report item card

  const { lineItems, totalCost, amountPaid, balanceGivenOut, shopName } = data;

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

  const servedBy = () => (
    <Text style={styles.footerText1}>
      Served by:{" "}
      <Text style={styles.footerText2}>{data?.createdByFullName}</Text>
    </Text>
  );

  const renderShopName = () => (
    <Text style={styles.footerText2}>{shopName}</Text>
  );

  return (
    <View
      style={[styles.container, { borderWidth: balanceGivenOut < 0 ? 1 : 0 }]}
    >
      <CardHeader
        value1={`SN: ${data?.serialNumber}`}
        value2={`${formatDate(data?.soldOnDate, true)}`}
      />
      <CardHeader
        value1={renderShopName()}
        value2={`${extractTime(data.dateCreated)}`}
      />
      {expanded && (
        <Text
          style={{
            alignSelf: "flex-end",
            fontSize: 12,
          }}
        >
          Currency : UGX
        </Text>
      )}
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
              <Text>{formatNumberWithCommas(amountPaid)}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Amount</Text>
              <Text style={{ fontWeight: 600 }}>
                {formatNumberWithCommas(totalCost)}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Balance</Text>
              <Text>{formatNumberWithCommas(balanceGivenOut)}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 600 }}>Income</Text>
              <Text>{formatNumberWithCommas(profit)}</Text>
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
        <View style={{ flex: 1 }}>
          <SalesTable sales={lineItems} fixHeight={false} />
          <DataRow
            label={"Total"}
            value={formatNumberWithCommas(totalCost)}
            labelTextStyle={styles.label}
            style={{ marginTop: 5, marginBottom: 10 }}
            valueTextStyle={styles.value}
          />

          <DataRow
            label={"Recieved"}
            value={formatNumberWithCommas(amountPaid)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
          />
          <DataRow
            label={`Purchased ${
              itemCount > 1 ? `${itemCount} items` : `${itemCount} item`
            }`}
            value={formatNumberWithCommas(totalCost)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
          />

          <DataRow
            label={"Balance"}
            value={formatNumberWithCommas(balanceGivenOut)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
          />
          <DataRow
            label={"Income"}
            value={formatNumberWithCommas(profit)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.value}
          />

          {balanceGivenOut < 0 && (
            <DataRow
              label={"Client PhoneNumber"}
              value={data?.clientPhoneNumber}
              labelTextStyle={styles.label}
              valueTextStyle={styles.value}
            />
          )}

          <CardFooter2
            onBtnPress={toggleExpand}
            btnTitle="Hide"
            label={servedBy(false)}
          />
        </View>
      )}
    </View>
  );
}

export default memo(SaleTransactionItem);
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
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
